import { useState } from "react";
import { Link } from "react-router-dom";
import { Linkify, PageHead, orderHref } from "../components/ui";

type Msg = { staff: boolean; text: string };
const META = [
  { who: "Paolo Reyes", order: "CK-1047" }, { who: "Leo Garcia", order: "CK-1039" },
  { who: "Juana Dela Cruz", order: "CK-1042" }, { who: "Rina Uy", order: "OR-2213" },
];
const INITIAL: Msg[][] = [
  [{ staff: false, text: "Can we move pickup to 10 AM?" }],
  [{ staff: false, text: "Hi, I paid the balance for CK-1039 via bank transfer, ref BT-117." }],
  [{ staff: true, text: "Deposit verified. See you on the 17th!" }, { staff: false, text: "Thank you so much!" }],
  [{ staff: false, text: "Do you have eggless options for cupcakes?" }],
];

export function Messages() {
  const [threads, setThreads] = useState(INITIAL);
  const [sel, setSel] = useState(0);
  const [draft, setDraft] = useState("");
  const post = (text: string) => {
    if (!text) return;
    setThreads(threads.map((t, i) => (i === sel ? [...t, { staff: true, text }] : t)));
    setDraft("");
  };
  const cur = META[sel]!;
  return (
    <>
      <PageHead title="Messages" subtitle="Order conversations with customers" />
      <div className="split">
        <div className="side thread-list" role="group" aria-label="Conversations">
          {META.map((m, i) => {
            const last = threads[i]![threads[i]!.length - 1]!.text;
            return (
              <button key={m.order} type="button" className="thread-btn" aria-pressed={i === sel} onClick={() => setSel(i)}>
                <strong>{m.who} · {m.order}</strong><small>{last.length > 40 ? `${last.slice(0, 40)}…` : last}</small>
              </button>
            );
          })}
        </div>
        <section className="card grow stack" aria-label="Conversation">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <h2>{cur.who} · {cur.order}</h2><Link to={orderHref(cur.order)} style={{ fontSize: 14 }}>Open {cur.order}</Link>
          </div>
          <div className="bubbles" aria-live="polite">
            {threads[sel]!.map((m, i) => <div key={i} className={`bubble${m.staff ? " staff" : ""}`}><Linkify text={m.text} /></div>)}
          </div>
          <div className="actions">
            <button type="button" className="btn-pill sm" onClick={() => post("Noted, thank you!")}>Quick reply: “Noted, thank you!”</button>
            <button type="button" className="btn-pill sm" onClick={() => post("Good news, your order is ready for pickup.")}>“Your order is ready”</button>
          </div>
          <form className="reply" onSubmit={(e) => { e.preventDefault(); post(draft.trim()); }}>
            <label htmlFor="ar" className="sr">Reply</label>
            <input id="ar" type="text" placeholder="Reply as Kreative Cakes…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button type="submit" className="btn-pill dark">Send</button>
          </form>
        </section>
      </div>
    </>
  );
}
