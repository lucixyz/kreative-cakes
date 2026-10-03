import { useState } from "react";
import { Link } from "react-router-dom";
import { THREADS, type Msg } from "../../data/account";

export function Messages() {
  const [threads, setThreads] = useState<Record<string, Msg[]>>(() => Object.fromEntries(THREADS.map((t) => [t.id, t.messages])));
  const [sel, setSel] = useState(THREADS[0]!.id);
  const [draft, setDraft] = useState("");
  const cur = THREADS.find((t) => t.id === sel)!;
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setThreads({ ...threads, [sel]: [...threads[sel]!, { mine: true, text, when: "Just now" }] });
    setDraft("");
  };
  return (
    <>
      <h1>Messages</h1>
      <div className="messages">
        <div className="thread-list" role="group" aria-label="Conversations">
          {THREADS.map((t) => {
            const last = threads[t.id]!.at(-1)!.text;
            return (
              <button key={t.id} type="button" className="thread" aria-pressed={t.id === sel} onClick={() => setSel(t.id)}>
                <span className="thread-top"><strong>{t.title}</strong><span className="muted small">{t.when}</span></span>
                <span className="muted small">{last.length > 56 ? `${last.slice(0, 56)}…` : last}</span>
              </button>
            );
          })}
        </div>
        <section className="card chat" aria-label="Conversation">
          <div className="chat-head"><div><strong>{cur.title}</strong><span className="muted small"> · {cur.status}</span></div><Link to={cur.to} className="text-link small">View order</Link></div>
          <div className="bubbles" aria-live="polite">
            {threads[sel]!.map((m, i) => (
              <div key={i} className={`bubble${m.mine ? " mine" : ""}`}>{m.text}<span className="small">{m.mine ? m.when : `Bakery · ${m.when}`}</span></div>
            ))}
          </div>
          <form className="row tight composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <label htmlFor="mi" className="sr">Write a message</label>
            <input id="mi" type="text" placeholder="Write a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button type="submit" className="pill dark">Send</button>
          </form>
        </section>
      </div>
    </>
  );
}
