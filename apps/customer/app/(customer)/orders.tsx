import { ComingSoon } from "@cakeshop/ui";
import { RequireCustomer } from "../../src/components/RequireCustomer";

export default function Orders() {
  return (
    <RequireCustomer>
      <ComingSoon title="My orders" />
    </RequireCustomer>
  );
}
