import type { ReactNode } from "react";

export function AuthScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="page" style={{ alignItems: "center" }}>
      <div className="auth-card">
        <h1 style={{ fontSize: 28 }}>{title}</h1>
        {children}
      </div>
    </main>
  );
}
