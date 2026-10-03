import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, Pill, Segmented, type Tone } from "../components/ui";

type Status = "pending" | "published" | "hidden";
const BASE = [
  { who: "Juana D.", product: "Strawberry Chiffon Dream", when: "Oct 1", stars: 5 },
  { who: "Leo G.", product: "Custom corporate cake", when: "Sep 29", stars: 4 },
  { who: "Mika T.", product: "Ube Macapuno", when: "Sep 25", stars: 5 },
  { who: "Anonymous", product: "Matcha Bento", when: "Sep 20", stars: 2 },
];
const LABEL: Record<Status, [string, Tone]> = { pending: ["Pending", "amber"], published: ["Published", "green"], hidden: ["Hidden", "grey"] };

export function Reviews() {
  const [status, setStatus] = useState<Status[]>(["pending", "pending", "published", "hidden"]);
  const [tab, setTab] = useState<"all" | Status>("all");
  const set = (i: number, v: Status) => setStatus(status.map((s, j) => (j === i ? v : s)));
  return (
    <>
      <PageHead title="Reviews" subtitle="Customer reviews of completed orders" />
      <Segmented label="Review status" value={tab} onChange={setTab} options={[{ id: "all", label: "All" }, { id: "pending", label: "Pending" }, { id: "published", label: "Published" }, { id: "hidden", label: "Hidden" }]} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {BASE.map((b, i) => {
          const st = status[i]!;
          if (tab !== "all" && tab !== st) return null;
          return (
            <article key={b.who + b.product} className="card stack">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <div><strong>{b.who}</strong> <span className="crumb">· {b.product} · {b.when}</span></div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="stars" role="img" aria-label={`${b.stars} out of 5 stars`}>{"★".repeat(b.stars)}{"☆".repeat(5 - b.stars)}</span>
                  <Pill tone={LABEL[st][1]}>{LABEL[st][0]}</Pill>
                </div>
              </div>
              <p style={{ margin: 0, color: "#4a3f38" }}>[Customer review text]</p>
              <div className="actions">
                {st === "pending" ? (
                  <>
                    <button type="button" className="btn-pill dark sm" onClick={() => set(i, "published")}>Publish</button>
                    <button type="button" className="btn-pill sm" onClick={() => set(i, "hidden")}>Hide</button>
                  </>
                ) : (
                  <button type="button" className="btn-pill sm" onClick={() => set(i, "pending")}>Move back to pending</button>
                )}
                <Link to="/dashboard/messages" className="btn-pill sm">Reply privately</Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
