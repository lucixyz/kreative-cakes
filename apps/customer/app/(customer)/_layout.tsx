import { Stack } from "expo-router";

// Customer-facing routes (URL-transparent group): /, /login, /signup, /shop, /cart, ...
// Routes needing a signed-in customer live in the nested (account) group.
export default function CustomerLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
