import { Link } from "react-router-dom";

// Facts the bakery must supply are shown as [bracketed placeholders] so nothing is invented.

export function About() {
  return (
    <main className="page-wrap narrow">
      <h1>About Kreative Cakes</h1>
      <p className="lead muted">Cakes for birthdays, weddings, anniversaries and corporate events, ready-made or designed with you.</p>
      <section className="card stack">
        <h2>Our story</h2>
        <p className="muted">[The bakery’s own story goes here: who bakes, where the recipes come from, and what you are known for.]</p>
      </section>
      <section className="card stack">
        <h2>How we work</h2>
        <ul className="plain-list">
          <li><strong>Ready-made cakes</strong> are ordered online for pickup or delivery on a date you choose.</li>
          <li><strong>Custom cakes</strong> start with your idea in the AI Designer or the Cake Builder. Our bakers review every design and send a quotation before you pay anything.</li>
          <li><strong>Allergens</strong> are listed on every cake. Our kitchen also handles nuts, so ask us before ordering if allergies matter.</li>
        </ul>
        <div className="row"><Link to="/shop" className="pill dark">Shop Cakes</Link><Link to="/ai-designer" className="pill outline-dark">Design Your Cake</Link></div>
      </section>
    </main>
  );
}

export function Contact() {
  return (
    <main className="page-wrap narrow">
      <h1>Contact us</h1>
      <p className="lead muted">Questions about an order, a design or an allergy? Reach the bakery here.</p>
      <section className="card stack">
        <dl className="info-rows plain">
          <div><dt>Phone</dt><dd>[Phone number]</dd></div>
          <div><dt>Email</dt><dd>[Email address]</dd></div>
          <div><dt>Pickup location</dt><dd>[Store address]</dd></div>
          <div><dt>Opening hours</dt><dd>[Opening hours]</dd></div>
        </dl>
        <p className="note">Already ordering? Message the bakery from your <Link to="/messages" className="underline">account</Link> so it stays attached to your order.</p>
      </section>
    </main>
  );
}
