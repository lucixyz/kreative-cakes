import { peso } from "../format";
import { zodResolver } from "@hookform/resolvers/zod";
import { storefrontProducts } from "@cakeshop/database";
import { cartSubtotal, deliveryFee, orderTotal } from "@cakeshop/domain";
import { CHECKOUT_PAYMENT_METHODS, TIME_SLOTS, checkoutSchema, type CheckoutInput } from "@cakeshop/validation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { Field } from "../components/Field";

const PAYMENTS: Record<(typeof CHECKOUT_PAYMENT_METHODS)[number], [string, string]> = {
  gcash: ["GCash", "Pay with your GCash wallet"],
  maya: ["Maya", "Pay with your Maya wallet"],
  card: ["Credit or debit card", "Visa, Mastercard"],
  online_banking: ["Online banking", "Pay from your bank app"],
};

const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function Checkout() {
  const { lines, clear } = useCart();
  const [placed, setPlaced] = useState<{ ref: string; total: number } | null>(null);

  // Earliest date we can fulfill = today + the longest pre-order lead time in the cart.
  const earliest = useMemo(() => {
    const lead = Math.max(0, ...lines.map((l) => {
      const a = storefrontProducts.find((p) => p.id === l.productId)?.availability;
      return a?.kind === "preorder" ? a.days : 0;
    }));
    const d = new Date();
    d.setDate(d.getDate() + lead);
    return isoDate(d);
  }, [lines]);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fulfillment: "delivery", fullName: "", mobile: "", email: "", street: "", barangay: "", city: "", notes: "", date: earliest, timeSlot: TIME_SLOTS[0], paymentMethod: "gcash" },
  });
  const fulfillment = watch("fulfillment");

  if (placed) {
    return (
      <main className="page-wrap narrow">
        <h1>Thank you!</h1>
        <p>Your order <strong>{placed.ref}</strong> ({peso(placed.total)}) was recorded.</p>
        <p className="note">This is a prototype: no payment was taken and no order was sent to the bakery yet.</p>
        <Link to="/shop" className="pill dark">Keep shopping</Link>
      </main>
    );
  }
  if (lines.length === 0) {
    return <main className="page-wrap narrow"><h1>Checkout</h1><div className="empty"><p>Your cart is empty.</p><Link to="/shop" className="pill dark">Shop cakes</Link></div></main>;
  }

  const total = orderTotal(lines, fulfillment);
  const submit = handleSubmit(async () => {
    // PROTOTYPE: the API will create the order, re-price it from the catalog and start the payment.
    await new Promise((r) => setTimeout(r, 400));
    setPlaced({ ref: `KC-${Date.now().toString(36).toUpperCase()}`, total });
    clear();
  });

  return (
    <main className="page-wrap">
      <p className="crumbs"><Link to="/cart">← Back to cart</Link></p>
      <h1>Checkout</h1>
      <form className="checkout" onSubmit={submit} noValidate>
        <div className="stack">
          <section className="card">
            <h2>How would you like it?</h2>
            <div className="segmented" role="radiogroup" aria-label="Fulfillment">
              {(["delivery", "pickup"] as const).map((f) => (
                <label key={f} className={fulfillment === f ? "on" : ""}><input type="radio" value={f} {...register("fulfillment")} /> {f === "delivery" ? "Delivery" : "Pickup"}</label>
              ))}
            </div>
          </section>

          <section className="card stack">
            <h2>Contact information</h2>
            <Field label="Full name" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
            <Field label="Mobile number" type="tel" placeholder="09XX XXX XXXX" autoComplete="tel" error={errors.mobile?.message} {...register("mobile")} />
            <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          </section>

          {fulfillment === "delivery" ? (
            <section className="card stack">
              <h2>Delivery address</h2>
              <Field label="House no., street, subdivision" error={errors.street?.message} {...register("street")} />
              <div className="two-col">
                <Field label="Barangay" error={errors.barangay?.message} {...register("barangay")} />
                <Field label="City" error={errors.city?.message} {...register("city")} />
              </div>
              <Field label="Landmark or rider notes (optional)" error={errors.notes?.message} {...register("notes")} />
            </section>
          ) : null}

          <section className="card stack">
            <h2>{fulfillment === "delivery" ? "Delivery" : "Pickup"} date and time</h2>
            <div className="two-col">
              <Field label="Date" type="date" min={earliest} error={errors.date?.message} {...register("date")} />
              <div className="field"><label>Time slot<select {...register("timeSlot")}>{TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}</select></label></div>
            </div>
            <p className="muted small">Only dates we can fulfill are shown.</p>
          </section>

          <section className="card stack">
            <h2>Payment method</h2>
            {CHECKOUT_PAYMENT_METHODS.map((m) => (
              <label key={m} className={`pay-opt${watch("paymentMethod") === m ? " on" : ""}`}>
                <input type="radio" value={m} {...register("paymentMethod")} />
                <span><strong>{PAYMENTS[m][0]}</strong><br /><span className="muted small">{PAYMENTS[m][1]}</span></span>
              </label>
            ))}
            <p className="muted small">🔒 You’ll complete payment on a secure PayMongo page. (Prototype: no payment is taken yet.)</p>
          </section>
        </div>

        <aside className="card summary stack" aria-label="Order summary">
          <h2>Order summary</h2>
          {lines.map((l) => (
            <div key={`${l.productId}${l.sizeId}${l.flavor}`} className="sum-line"><span>{l.name} · {l.sizeLabel} × {l.quantity}</span><span>{peso(l.unitPriceCentavos * l.quantity)}</span></div>
          ))}
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{peso(cartSubtotal(lines))}</dd></div>
            <div><dt>Delivery</dt><dd>{fulfillment === "pickup" ? "Free (pickup)" : peso(deliveryFee(fulfillment, lines))}</dd></div>
            <div className="grand"><dt>Total</dt><dd>{peso(total)}</dd></div>
          </dl>
          <button className="pill dark block" type="submit" disabled={isSubmitting}>{isSubmitting ? "Placing order…" : "Place order & pay"}</button>
        </aside>
      </form>
    </main>
  );
}
