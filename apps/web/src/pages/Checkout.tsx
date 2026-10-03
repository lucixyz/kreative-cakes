import { zodResolver } from "@hookform/resolvers/zod";
import { storefrontProducts } from "@cakeshop/database";
import { cartSubtotal, deliveryFee, lineKey, orderTotal, type CartLine, type Fulfillment } from "@cakeshop/domain";
import { CHECKOUT_PAYMENT_METHODS, TIME_SLOTS, checkoutSchema, type CheckoutInput } from "@cakeshop/validation";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { Field } from "../components/Field";
import { peso } from "../format";

const PAYMENTS: Record<(typeof CHECKOUT_PAYMENT_METHODS)[number], [string, string]> = {
  gcash: ["GCash", "You’ll be sent to GCash to approve the payment."],
  maya: ["Maya", "You’ll be sent to Maya to approve the payment."],
  card: ["Credit or debit card", "Visa or Mastercard, entered on the secure PayMongo page."],
  online_banking: ["Online banking", "You’ll pick your bank and approve it in your bank app."],
};

const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const longDate = (iso: string) => new Intl.DateTimeFormat("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(`${iso}T00:00:00`));

type Placed = { ref: string; total: number; lines: CartLine[]; fulfillment: Fulfillment; date: string; timeSlot: string; method: string; email: string };

export function Checkout() {
  const { lines, clear } = useCart();
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [failed, setFailed] = useState(false);
  const busy = useRef(false);

  // Earliest date we can fulfill = today + the longest pre-order lead time in the cart.
  const { earliest, lead } = useMemo(() => {
    const days = Math.max(0, ...lines.map((l) => {
      const a = storefrontProducts.find((p) => p.id === l.productId)?.availability;
      return a?.kind === "preorder" ? a.days : 0;
    }));
    const d = new Date();
    d.setDate(d.getDate() + days);
    return { earliest: isoDate(d), lead: days };
  }, [lines]);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fulfillment: "delivery", fullName: "", mobile: "", email: "", street: "", barangay: "", city: "", notes: "", date: earliest, timeSlot: TIME_SLOTS[0], paymentMethod: "gcash" },
  });
  const fulfillment = watch("fulfillment");
  const method = watch("paymentMethod");

  if (placed) {
    return (
      <main className="page-wrap narrow">
        <div className="state-head">
          <h1>Thank you!</h1>
          <p className="muted">Order reference <strong>{placed.ref}</strong></p>
        </div>
        <section className="card stack" aria-label="Order summary">
          {placed.lines.map((l) => (
            <div key={lineKey(l)} className="sum-line">
              <span>{l.name} · {l.sizeLabel} · {l.flavor} × {l.quantity}{l.message ? <><br /><span className="muted small">Message: “{l.message}”</span></> : null}</span>
              <span>{peso(l.unitPriceCentavos * l.quantity)}</span>
            </div>
          ))}
          <dl className="totals plain"><div className="grand"><dt>Total</dt><dd>{peso(placed.total)}</dd></div></dl>
          <p><strong>{placed.fulfillment === "delivery" ? "Delivery" : "Pickup"}</strong> on {longDate(placed.date)}, {placed.timeSlot}</p>
        </section>
        <section className="card stack">
          <h2>What happens next</h2>
          <ol className="next-steps">
            <li>We confirm your payment by {PAYMENTS[placed.method as keyof typeof PAYMENTS]?.[0] ?? "your chosen method"}.</li>
            <li>The bakery prepares your order and may message you at {placed.email} about the details.</li>
            <li>{placed.fulfillment === "delivery" ? "We deliver it on the date and time above." : "Pick up at [store location] on the date and time above."}</li>
          </ol>
          <p className="note">This is a prototype: no payment was taken and no order was sent to the bakery yet.</p>
        </section>
        <div className="row"><Link to="/orders" className="pill outline-dark">Track my orders</Link><Link to="/shop" className="pill dark">Keep shopping</Link></div>
      </main>
    );
  }
  if (lines.length === 0) {
    return <main className="page-wrap narrow"><h1>Checkout</h1><div className="empty"><p>Your cart is empty.</p><Link to="/shop" className="pill dark">Shop cakes</Link></div></main>;
  }

  const total = orderTotal(lines, fulfillment);
  const submit = handleSubmit(async (values) => {
    if (busy.current) return;
    busy.current = true;
    setFailed(false);
    try {
      // PROTOTYPE: the API will create the order, re-price it from the catalog and start the payment.
      await new Promise((r) => setTimeout(r, 500));
      setPlaced({ ref: `KC-${Date.now().toString(36).toUpperCase()}`, total, lines: [...lines], fulfillment: values.fulfillment, date: values.date, timeSlot: values.timeSlot, method: values.paymentMethod, email: values.email });
      clear();
    } catch {
      setFailed(true);
    } finally {
      busy.current = false;
    }
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
            <p className="muted small">{fulfillment === "delivery" ? "A delivery fee applies and is shown in your summary." : "Pick up at [store location]. No delivery fee."}</p>
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
              <Field label="House no., street, subdivision" autoComplete="street-address" error={errors.street?.message} {...register("street")} />
              <div className="two-col">
                <Field label="Barangay" error={errors.barangay?.message} {...register("barangay")} />
                <Field label="City" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
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
            <p className="muted small">{lead > 0 ? `Your cart needs ${lead} ${lead === 1 ? "day" : "days"} of preparation, so the earliest date is ${longDate(earliest)}.` : "Everything in your cart is available today."}</p>
          </section>

          <section className="card stack">
            <h2>Payment method</h2>
            {CHECKOUT_PAYMENT_METHODS.map((m) => (
              <label key={m} className={`pay-opt${method === m ? " on" : ""}`}>
                <input type="radio" value={m} {...register("paymentMethod")} />
                <span><strong>{PAYMENTS[m][0]}</strong><br /><span className="muted small">{PAYMENTS[m][1]}</span></span>
              </label>
            ))}
            <p className="muted small">You complete payment on a secure PayMongo page. (Prototype: no payment is taken yet.)</p>
          </section>
        </div>

        <aside className="card summary stack" aria-label="Order summary">
          <h2>Order summary</h2>
          {lines.map((l) => (
            <div key={lineKey(l)} className="sum-line">
              <span>{l.name} · {l.sizeLabel} × {l.quantity}{l.message ? <><br /><span className="muted small">Message: “{l.message}”</span></> : null}</span>
              <span>{peso(l.unitPriceCentavos * l.quantity)}</span>
            </div>
          ))}
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{peso(cartSubtotal(lines))}</dd></div>
            <div><dt>Delivery</dt><dd>{fulfillment === "pickup" ? "Free (pickup)" : peso(deliveryFee(fulfillment, lines))}</dd></div>
            <div className="grand"><dt>Total</dt><dd>{peso(total)}</dd></div>
          </dl>
          {failed ? <p role="alert" className="error">We couldn’t place your order. Your cart is safe. Please try again.</p> : null}
          <button className="pill dark block" type="submit" disabled={isSubmitting}>{isSubmitting ? "Placing order…" : "Place order & pay"}</button>
        </aside>
      </form>
    </main>
  );
}
