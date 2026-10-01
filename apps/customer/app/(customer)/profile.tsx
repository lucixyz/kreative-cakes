import { useAuthService, useSession } from "@cakeshop/auth/react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RequireCustomer } from "../../src/components/RequireCustomer";
import { Btn, heading } from "../../src/components/ui";
import { c } from "../../src/theme";

export default function Profile() {
  const session = useSession();
  const service = useAuthService();
  const insets = useSafeAreaInsets();
  return (
    <RequireCustomer>
      <View style={{ flex: 1, backgroundColor: c.cream, padding: 20, paddingTop: insets.top + 20, gap: 12 }}>
        <Text style={heading(30)}>Profile</Text>
        <Text testID="signed-in-as" style={{ color: c.muted }}>Signed in as {session?.user.displayName} ({session?.user.role})</Text>
        <Btn label="Log out" variant="ghost" onPress={() => void service.signOut()} />
      </View>
    </RequireCustomer>
  );
}
