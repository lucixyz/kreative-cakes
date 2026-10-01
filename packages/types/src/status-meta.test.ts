import { describe, expect, it } from "vitest";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@cakeshop/validation";
import { CUSTOM_TRACKER_STAGES, ORDER_STATUS_META, PAYMENT_STATUS_META } from "./index";

describe("status meta", () => {
  it("has a label, icon and description for every status (never color alone)", () => {
    for (const s of ORDER_STATUSES) {
      const m = ORDER_STATUS_META[s];
      expect(m.label && m.icon && m.customerDescription).toBeTruthy();
    }
    for (const s of PAYMENT_STATUSES) expect(PAYMENT_STATUS_META[s].label).toBeTruthy();
  });
  it("tracker stages only use real statuses", () => {
    for (const stage of CUSTOM_TRACKER_STAGES) for (const s of stage.statuses) expect(ORDER_STATUSES).toContain(s);
  });
});
