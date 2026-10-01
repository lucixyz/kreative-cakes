import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FOOTER_COLUMNS } from "./data";

export function CustomCta() {
  return (
    <section className="cta-band">
      <h2>Have a Dream Cake in Mind?</h2>
      <p>Describe it to our AI, or build it yourself step by step.</p>
      <div className="row center">
        <Link to="/ai-designer" className="pill solid">Design with AI</Link>
        <Link to="/cake-builder" className="pill outline">Build Manually</Link>
      </div>
    </section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (/^\S+@\S+\.\S+$/.test(email)) setDone(true); // PROTOTYPE: no backend yet
  };
  return (
    <section className="section newsletter">
      <h2>Get sweet deals delivered to your inbox.</h2>
      <p className="muted">Join for promotions and, soon, loyalty rewards.</p>
      {done ? (
        <p role="status">Thanks! You’re on the list (demo).</p>
      ) : (
        <form className="news-form" onSubmit={submit}>
          <label className="sr" htmlFor="news-email">Email address</label>
          <input id="news-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="pill solid-dark" type="submit">Join</button>
        </form>
      )}
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <strong className="logo">Kreative Cakes</strong>
          <p>Handcrafted cakes and AI-designed custom cakes.</p>
          <p className="socials"><a href="https://www.facebook.com/kreativecakes.ph" target="_blank" rel="noreferrer">Facebook</a></p>
        </div>
        {FOOTER_COLUMNS.map((c) => (
          <div key={c.title}>
            <h3>{c.title}</h3>
            <ul>
              {c.links.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="footer-base">We accept GCash · Maya · Cards · Bank transfer · © {new Date().getFullYear()} Kreative Cakes</p>
    </footer>
  );
}
