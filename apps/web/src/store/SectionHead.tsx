export function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {sub ? <p className="muted">{sub}</p> : null}
      </div>
    </div>
  );
}
