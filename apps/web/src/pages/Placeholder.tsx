import { Link } from "react-router-dom";

/** Honest placeholder for routes that exist but are not built yet. */
export function Placeholder({ title, note = "Coming soon — this section is not built yet." }: { title: string; note?: string }) {
  return (
    <main className="page">
      <h1 style={{ fontSize: 24 }}>{title}</h1>
      <p className="muted">{note}</p>
      <Link to="/">Back to home</Link>
    </main>
  );
}
