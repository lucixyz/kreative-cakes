/** Honest placeholder for admin sections that exist but are not built yet. */
export function Section({ title, note = "Coming soon — this section is not built yet." }: { title: string; note?: string }) {
  return (
    <div className="page">
      <h1 style={{ fontSize: 24 }}>{title}</h1>
      <p className="muted">{note}</p>
    </div>
  );
}
