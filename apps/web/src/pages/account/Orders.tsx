import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, ReceiptIcon } from "../../components/Icons";
import { EmptyState } from "../../components/States";
import { ORDERS, SAVED_DESIGNS } from "../../data/account";

export function Orders() {
  const [tab, setTab] = useState<"active" | "past">("active");
  const orders = ORDERS.filter((o) => (tab === "active" ? o.active : !o.active));
  const count = (active: boolean) => ORDERS.filter((o) => o.active === active).length;
  return (
    <>
      <h1>My orders</h1>

      <div className="banner">
        <ReceiptIcon />
        <div><strong>A quotation is waiting for you</strong><p>Rustic Wedding Cake · ₱14,800 · valid until Oct 9</p></div>
        <Link to="/quotation" className="pill dark small">Review quote</Link>
      </div>

      <div role="group" aria-label="Filter orders" className="tabs">
        <button type="button" aria-pressed={tab === "active"} onClick={() => setTab("active")}>Active · {count(true)}</button>
        <button type="button" aria-pressed={tab === "past"} onClick={() => setTab("past")}>Past · {count(false)}</button>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" text="When you order or submit a custom cake, it will show up here.">
          <Link to="/ai-designer" className="pill dark">Design a cake</Link>
        </EmptyState>
      ) : (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id} className="order-card">
              <div className="order-thumb" style={{ background: o.tint }} aria-hidden="true" />
              <div className="order-info">
                <span className="muted small">{o.id} · {o.kind}</span>
                <strong>{o.name}</strong>
                <span className="muted">{o.when}</span>
              </div>
              <div className="order-side">
                <span className={`status ${o.tone}`}><i aria-hidden="true" />{o.status}</span>
                <strong>{o.total}</strong>
              </div>
              <Link to={o.to} className="pill outline-dark small">{o.action}</Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="sub-head">Saved designs</h2>
      <div className="design-grid">
        {SAVED_DESIGNS.map((d) => (
          <Link key={d.name} to="/cake-builder" className="design-card">
            <span className="design-art" style={{ background: d.tint }}>Design preview</span>
            <strong>{d.name}</strong><span className="muted small">{d.meta}</span>
          </Link>
        ))}
        <Link to="/ai-designer" className="design-card new"><PlusIcon /><strong>New design</strong></Link>
      </div>
    </>
  );
}
