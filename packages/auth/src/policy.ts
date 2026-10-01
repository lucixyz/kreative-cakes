import type { UserRole } from "@cakeshop/types";
import type { Portal } from "./types";

/** Which roles may hold a session in each portal. Customers can never enter the admin portal and vice versa. */
export const PORTAL_ROLES: Readonly<Record<Portal, readonly UserRole[]>> = {
  customer: ["customer"],
  admin: ["staff", "admin", "super_admin"],
};

export const isAllowedInPortal = (portal: Portal, role: UserRole): boolean => PORTAL_ROLES[portal].includes(role);

export const AUTH_POLICY = {
  /**
   * PROTOTYPE: MFA enrollment/verification is not built yet, so this is off. Flip to true when it
   * lands; guards and the API then reject admin sessions without `mfaVerified`.
   */
  adminRequiresMfa: false,
} as const;

/** Single message for every failed sign-in, so responses never reveal whether an account exists or its role. */
export const GENERIC_SIGN_IN_ERROR = "Invalid email or password.";
