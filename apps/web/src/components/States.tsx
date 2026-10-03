import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Shared loading / empty / error states. Messages never show technical errors. */
export function EmptyState({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="state">
      <h2>{title}</h2>
      <p className="muted">{text}</p>
      {children ? <div className="row tight">{children}</div> : null}
    </div>
  );
}

export function ErrorState({ title, text, onRetry, children }: { title: string; text: string; onRetry?: () => void; children?: ReactNode }) {
  return (
    <div className="state error-state" role="alert">
      <h2>{title}</h2>
      <p className="muted">{text}</p>
      <div className="row tight">
        {onRetry ? <button type="button" className="pill dark" onClick={onRetry}>Try again</button> : null}
        {children}
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6, label = "Loading cakes" }: { count?: number; label?: string }) {
  return (
    <div className="grid-3" role="status" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card" aria-hidden="true"><div className="skeleton shape" /><div className="skeleton line" /><div className="skeleton line short" /></div>
      ))}
    </div>
  );
}

export function Spinner({ title, text }: { title: string; text: string }) {
  return (
    <div className="state" role="status">
      <span className="spinner" aria-hidden="true" />
      <h2>{title}</h2>
      <p className="muted">{text}</p>
    </div>
  );
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to} className="text-link">{children}</Link>;
}
