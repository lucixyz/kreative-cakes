import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Split layout from the design: photo panel on the left, form card on the right. */
export function AuthScreen({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <main className="auth-split">
      <aside className="auth-photo" aria-hidden="true">
        <Link to="/" className="brand" tabIndex={-1}>Kreative Cakes</Link>
        <p>Your designs, quotes and orders in one place.</p>
      </aside>
      <div className="auth-panel">
        <div className="auth-card">
          <h1>{title}</h1>
          {note ? <p className="muted">{note}</p> : null}
          {children}
        </div>
      </div>
    </main>
  );
}
