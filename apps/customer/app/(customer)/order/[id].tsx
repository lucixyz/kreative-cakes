import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { BackHeader, Card, Page, StatusPill, useToast } from "../../../src/components/kit";
import { RequireCustomer } from "../../../src/components/RequireCustomer";
import { Btn, heading } from "../../../src/components/ui";
import { ORDERS, STEPS } from "../../../src/data/account";
import { c } from "../../../src/theme";

// PROTOTYPE: only CK-1042 has progress/payment data until the API provides orders.
export default function OrderTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const order = ORDERS.find((o) => o.id === id);

  return (
    <RequireCustomer>
      <View style={{ flex: 1 }}>
        <Page>
          <BackHeader title={order?.id ?? "Order"} subtitle={order?.name} fallback="/orders" />
          {!order || order.id !== "CK-1042" ? (
            <Card>
              <Text style={heading(22)}>{order ? "Tracking opens soon" : "We couldn’t find that order"}</Text>
              <Text style={{ color: c.muted }}>{order ? `${order.status} · ${order.when}` : "Check the order number, or open it from your orders list."}</Text>
              <Btn label="My orders" variant="ghost" onPress={() => router.replace("/orders")} />
            </Card>
          ) : (
            <>
              <Card>
                <Text style={{ color: c.muted, fontSize: 13 }}>Current status</Text>
                <Text style={heading(24)}>Scheduled for production</Text>
                <Text style={{ color: c.muted }}>Pickup Sat, Oct 17 · 2:00–4:00 PM</Text>
              </Card>
              <Card>
                <Text style={heading(22)}>Progress</Text>
                {STEPS.map((s, i) => (
                  <View key={s.title} style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ alignItems: "center" }}>
                      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: s.state === "next" ? "#CFC4B8" : s.state === "now" ? c.rose : "#7F9A6C", backgroundColor: s.state === "done" ? "#7F9A6C" : s.state === "now" ? c.rose : "#fff" }} />
                      {i < STEPS.length - 1 ? <View style={{ width: 2, flex: 1, minHeight: 22, backgroundColor: s.state === "done" ? "#7F9A6C" : c.line }} /> : null}
                    </View>
                    <View style={{ flex: 1, paddingBottom: 12 }}>
                      <Text accessibilityState={{ selected: s.state === "now" }} style={{ fontWeight: s.state === "next" ? "400" : "600", color: s.state === "next" ? c.muted : c.ink }}>{s.title}</Text>
                      <Text style={{ color: c.muted, fontSize: 13 }}>{s.when}</Text>
                    </View>
                  </View>
                ))}
              </Card>
              <Card>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><Text style={heading(22)}>Payment</Text><StatusPill tone="review" label="Partially paid" /></View>
                {[["Final quotation", "₱6,200"], ["Deposit · verified", "− ₱3,100"]].map(([k, v]) => (
                  <View key={k} style={{ flexDirection: "row", justifyContent: "space-between" }}><Text>{k}</Text><Text>{v}</Text></View>
                ))}
                <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: c.line, paddingTop: 10 }}>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>Balance due Oct 15</Text><Text style={{ fontWeight: "700", fontSize: 18 }}>₱3,100</Text>
                </View>
                <Btn label="Pay balance" onPress={() => toast.show("Payment opens in PayMongo. Not connected yet.")} />
              </Card>
              <Btn label="Message the bakery" variant="ghost" onPress={() => router.push("/messages")} />
            </>
          )}
        </Page>
        {toast.node}
      </View>
    </RequireCustomer>
  );
}
