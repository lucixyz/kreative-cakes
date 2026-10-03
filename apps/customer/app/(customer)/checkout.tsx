import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { storefrontProducts } from "@cakeshop/database";
import { deliveryFee, orderTotal } from "@cakeshop/domain";
import { CHECKOUT_PAYMENT_METHODS, TIME_SLOTS, checkoutSchema, type CheckoutInput } from "@cakeshop/validation";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../src/cart/CartContext";
import { peso } from "../../src/components/ProductTile";
import { Btn, heading } from "../../src/components/ui";
import { MIN_TOUCH, c } from "../../src/theme";

const PAYMENTS: Record<(typeof CHECKOUT_PAYMENT_METHODS)[number], [string, string]> = {
  gcash: ["GCash", "Pay with your GCash wallet"],
  maya: ["Maya", "Pay with your Maya wallet"],
  card: ["Credit or debit card", "Visa, Mastercard"],
  online_banking: ["Online banking", "Pay from your bank app"],
};

const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const card = { backgroundColor: "#fff", borderRadius: 20, borderWidth: 1, borderColor: c.line, padding: 20, gap: 12 } as const;

function Input({ label, error, ...input }: { label: string; error?: string | undefined } & TextInputProps) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: c.ink, fontSize: 15 }}>{label}</Text>
      <TextInput accessibilityLabel={label} placeholderTextColor={c.muted} {...input} style={{ minHeight: MIN_TOUCH + 4, borderRadius: 16, borderWidth: 1, borderColor: error ? c.danger : "#D3C8BC", backgroundColor: "#fff", paddingHorizontal: 16, fontSize: 16, color: c.ink }} />
      {error ? <Text accessibilityRole="alert" style={{ color: c.danger }}>{error}</Text> : null}
    </View>
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lines, clear } = useCart();

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

  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fulfillment: "delivery", fullName: "", mobile: "", email: "", street: "", barangay: "", city: "", notes: "", date: earliest, timeSlot: TIME_SLOTS[0], paymentMethod: "gcash" },
  });
  const fulfillment = watch("fulfillment");
  const payment = watch("paymentMethod");
  const slot = watch("timeSlot");

  const back = (
    <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/cart"))} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#fff", borderWidth: 1, borderColor: c.line, alignItems: "center", justifyContent: "center" }}><Ionicons name="chevron-back" size={22} color={c.ink} /></Pressable>
  );

  if (lines.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: c.cream, padding: 20, paddingTop: insets.top + 12, gap: 20 }}>
        {back}<Text style={{ color: c.muted, fontSize: 16 }}>Your cart is empty.</Text><Btn label="Shop cakes" onPress={() => router.replace("/shop")} />
      </View>
    );
  }

  const total = orderTotal(lines, fulfillment);
  const submit = handleSubmit(async () => {
    // PROTOTYPE: the API will create the order, re-price it from the catalog and start the payment.
    await new Promise((r) => setTimeout(r, 400));
    router.replace({ pathname: "/order-confirmed", params: { ref: `KC-${Date.now().toString(36).toUpperCase()}`, total: String(total), mode: fulfillment, method: payment } });
    clear();
  });

  const field = (name: keyof CheckoutInput, label: string, props: TextInputProps = {}) => (
    <Controller control={control} name={name} render={({ field: f }) => (
      <Input label={label} error={errors[name]?.message} value={String(f.value ?? "")} onChangeText={f.onChange} onBlur={f.onBlur} {...props} />
    )} />
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.cream }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, gap: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>{back}<Text style={heading(32)}>Checkout</Text></View>

        <View style={card}>
          <Text style={{ fontWeight: "700", fontSize: 18 }}>How would you like it?</Text>
          <View style={{ flexDirection: "row", backgroundColor: "#ECE6DF", borderRadius: 999, padding: 4 }}>
            {(["delivery", "pickup"] as const).map((f) => (
              <Pressable key={f} accessibilityRole="button" accessibilityState={{ selected: fulfillment === f }} onPress={() => setValue("fulfillment", f)} style={{ flex: 1, minHeight: 48, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: fulfillment === f ? c.ink : "transparent" }}>
                <Text style={{ color: fulfillment === f ? "#fff" : c.ink, fontWeight: "600", fontSize: 16 }}>{f === "delivery" ? "Delivery" : "Pickup"}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={card}>
          <Text style={{ fontWeight: "700", fontSize: 18 }}>Contact information</Text>
          {field("fullName", "Full name", { autoComplete: "name" })}
          {field("mobile", "Mobile number", { placeholder: "09XX XXX XXXX", keyboardType: "phone-pad", autoComplete: "tel" })}
          {field("email", "Email", { keyboardType: "email-address", autoCapitalize: "none", autoComplete: "email" })}
        </View>

        {fulfillment === "delivery" ? (
          <View style={card}>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>Delivery address</Text>
            {field("street", "House no., street, subdivision")}
            {field("barangay", "Barangay")}
            {field("city", "City")}
            {field("notes", "Landmark or rider notes (optional)")}
          </View>
        ) : null}

        <View style={card}>
          <Text style={{ fontWeight: "700", fontSize: 18 }}>{fulfillment === "delivery" ? "Delivery" : "Pickup"} date and time</Text>
          {field("date", "Date (YYYY-MM-DD)", { keyboardType: "numbers-and-punctuation" })}
          <Text style={{ color: c.muted, fontSize: 13 }}>Earliest available date: {earliest}.</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {TIME_SLOTS.map((t) => (
              <Pressable key={t} accessibilityRole="button" accessibilityState={{ selected: slot === t }} onPress={() => setValue("timeSlot", t)} style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: 999, justifyContent: "center", backgroundColor: slot === t ? c.ink : "#fff", borderWidth: 1.5, borderColor: slot === t ? c.ink : "#D3C8BC" }}>
                <Text style={{ color: slot === t ? "#fff" : c.ink }}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={card}>
          <Text style={{ fontWeight: "700", fontSize: 18 }}>Payment method</Text>
          {CHECKOUT_PAYMENT_METHODS.map((m) => (
            <Pressable key={m} accessibilityRole="radio" accessibilityState={{ checked: payment === m }} onPress={() => setValue("paymentMethod", m)} style={{ flexDirection: "row", gap: 14, alignItems: "center", minHeight: 64, borderRadius: 16, borderWidth: 2, borderColor: payment === m ? c.ink : c.line, paddingHorizontal: 16 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: payment === m ? c.ink : "#BDB1A5", alignItems: "center", justifyContent: "center" }}>{payment === m ? <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c.ink }} /> : null}</View>
              <View><Text style={{ fontWeight: "600", fontSize: 17 }}>{PAYMENTS[m][0]}</Text><Text style={{ color: c.muted, fontSize: 14 }}>{PAYMENTS[m][1]}</Text></View>
            </Pressable>
          ))}
          <Text style={{ color: c.muted, fontSize: 14 }}>🔒 You’ll complete payment on a secure PayMongo page. (Prototype: no payment is taken yet.)</Text>
        </View>

        <View style={card}>
          <Text style={{ fontWeight: "700", fontSize: 18 }}>Order summary</Text>
          {lines.map((l) => (
            <View key={`${l.productId}${l.sizeId}${l.flavor}`} style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <Text style={{ flex: 1, fontSize: 15 }}>{l.name} · {l.sizeLabel} × {l.quantity}</Text>
              <Text style={{ fontSize: 15 }}>{peso(l.unitPriceCentavos * l.quantity)}</Text>
            </View>
          ))}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: c.muted }}>Delivery</Text><Text style={{ color: c.muted }}>{fulfillment === "pickup" ? "Free (pickup)" : peso(deliveryFee(fulfillment, lines))}</Text></View>
        </View>
      </ScrollView>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: c.line }}>
        <View><Text style={{ color: c.muted, fontSize: 13 }}>Total</Text><Text style={{ fontSize: 22, fontWeight: "700" }}>{peso(total)}</Text></View>
        <Btn label={isSubmitting ? "Placing order…" : "Place order & pay"} disabled={isSubmitting} onPress={() => void submit()} style={{ flex: 1 }} />
      </View>
    </View>
  );
}
