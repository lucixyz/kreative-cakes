import type { UserRole } from "@cakeshop/types";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  /** Assigned server-side. The client only ever READS this; changing it locally grants nothing. */
  role: UserRole;
};

export type AuthSession = {
  user: AuthUser;
  /** True once a second factor was verified in this session (see AUTH_POLICY.adminRequiresMfa). */
  mfaVerified: boolean;
  /** ISO timestamp. */
  expiresAt: string;
};

/** The two entry points. They are separate apps/URLs with separate sessions. */
export type Portal = "customer" | "admin";
