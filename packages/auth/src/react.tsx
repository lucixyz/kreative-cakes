import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { AuthService } from "./service";
import type { AuthSession } from "./types";

const AuthContext = createContext<AuthService | null>(null);

export function AuthProvider({ service, children }: { service: AuthService; children: ReactNode }) {
  return <AuthContext.Provider value={service}>{children}</AuthContext.Provider>;
}

export function useAuthService(): AuthService {
  const service = useContext(AuthContext);
  if (!service) throw new Error("useAuthService must be used inside <AuthProvider>.");
  return service;
}

/** Current session, re-rendering on sign-in/out. Server-authoritative data; never edit it client-side. */
export function useSession(): AuthSession | null {
  const service = useAuthService();
  return useSyncExternalStore(service.subscribe, service.getSession, service.getSession);
}
