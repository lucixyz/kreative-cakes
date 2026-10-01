import { useAuthService, useSession } from "@cakeshop/auth/react";
import { mockCatalog, mockPriceRules, demoButterflyCake } from "@cakeshop/database";
import { calculateCakeEstimate, estimateServings } from "@cakeshop/domain";
import { Button } from "@cakeshop/ui";
import { formatMoney } from "@cakeshop/utils";
import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

// PROTOTYPE home. The real Home screen is built in the UI phase.
export default function Home() {
  const session = useSession();
  const service = useAuthService();
  const estimate = calculateCakeEstimate(demoButterflyCake, mockCatalog, mockPriceRules);

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "600" }}>Kreative Cakes</Text>
      <Text>Prototype · customer app</Text>

      {session ? (
        <View style={{ gap: 8 }}>
          <Text testID="signed-in-as">Signed in as {session.user.displayName} ({session.user.role})</Text>
          <Link href="/orders">My orders</Link>
          <Link href="/profile">My profile</Link>
          <Button label="Log out" variant="secondary" onPress={() => void service.signOut()} />
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          <Link href="/login">Log in</Link>
          <Link href="/signup">Create an account</Link>
        </View>
      )}

      <View style={{ gap: 4 }}>
        <Link href="/shop">Shop</Link>
        <Link href="/cake-builder">Cake builder</Link>
        <Link href="/ai-designer">AI designer</Link>
        <Link href="/cart">Cart</Link>
      </View>

      <View style={{ marginTop: 16, gap: 4 }}>
        <Text>Demo: {demoButterflyCake.name}</Text>
        <Text>Servings: {estimateServings(demoButterflyCake, mockCatalog)}</Text>
        <Text>Estimate: {formatMoney(estimate.estimatedTotal)} (estimate only)</Text>
      </View>
    </ScrollView>
  );
}
