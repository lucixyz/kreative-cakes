import { Link } from "react-router-dom";
import { POLICIES, type PolicyKey } from "../data/account";

const ORDER = Object.keys(POLICIES) as PolicyKey[];

/** Policies & help. Draft wording: a lawyer must review before launch. */
export function Legal({ tab }: { tab: PolicyKey }) {
  const doc = POLICIES[tab];
  return (
    <main className="page-wrap narrow">
      <h1>Policies &amp; help</h1>
      <p className="muted">Draft structure. Final wording should be reviewed by a lawyer before launch.</p>
      <nav aria-label="Policy" className="tabs legal-tabs">
        {ORDER.map((k) => <Link key={k} to={`/${k}`} aria-current={k === tab ? "page" : undefined}>{POLICIES[k].label}</Link>)}
      </nav>
      <article className="card legal">
        <h2 className="legal-title">{doc.label}</h2>
        {doc.sections.map(([heading, body]) => <section key={heading}><h3>{heading}</h3><p className="muted">{body}</p></section>)}
      </article>
    </main>
  );
}
