import { useState } from "react";
import { Field, PageHead, Switch } from "../components/ui";

type Toggle = { name: string; note: string; on: boolean };
const METHODS: Toggle[] = [
  { name: "GCash", note: "via PayMongo", on: true }, { name: "Maya", note: "via PayMongo", on: true }, { name: "Cards", note: "via PayMongo", on: true },
  { name: "Online banking", note: "via PayMongo", on: true }, { name: "Bank transfer with proof", note: "Manual verification", on: true }, { name: "Cash on pickup", note: "Ready-made only", on: false },
];
const ZONES = [
  { name: "Zone 1", areas: "[Areas within 5 km]", fee: "₱120", on: true },
  { name: "Zone 2", areas: "[Areas within 10 km]", fee: "₱180", on: true },
  { name: "Zone 3", areas: "[Areas within 20 km]", fee: "₱250", on: true },
];

function Num({ id, label, value }: { id: string; label: string; value: number }) {
  return <Field id={id} label={label}><input id={id} type="number" min={0} defaultValue={value} /></Field>;
}

export function Settings() {
  const [methods, setMethods] = useState(METHODS);
  const [zones, setZones] = useState(ZONES);
  const [dirty, setDirty] = useState(false);
  const touch = () => setDirty(true);

  return (
    <div style={{ display: "contents" }} onChange={touch}>
      <PageHead title="Settings" subtitle="Business rules used across the store, builder and checkout">
        <div className="savebar" role="status">
          <span>{dirty ? "Unsaved changes" : "All changes saved"}</span>
          <button type="button" className="btn-pill dark" disabled={!dirty} onClick={() => setDirty(false)}>Save changes</button>
        </div>
      </PageHead>

      <section className="card stack">
        <h2>Store</h2>
        <div className="adm-grid2">
          <Field id="sn" label="Store name"><input id="sn" type="text" defaultValue="Kreative Cakes" /></Field>
          <Field id="sp" label="Contact number"><input id="sp" type="text" defaultValue="[Phone]" /></Field>
        </div>
        <Field id="sa" label="Pickup address"><input id="sa" type="text" defaultValue="[Store address]" /></Field>
        <div className="adm-grid2">
          <Field id="so" label="Opens"><input id="so" type="time" defaultValue="08:00" /></Field>
          <Field id="sc" label="Closes"><input id="sc" type="time" defaultValue="19:00" /></Field>
        </div>
      </section>

      <section className="card stack">
        <h2>Lead times &amp; capacity</h2>
        <div className="adm-grid2">
          <Num id="l1" label="Simple custom cake (days)" value={3} />
          <Num id="l2" label="3+ tiers (days)" value={7} />
          <Num id="l3" label="Custom cakes per day" value={8} />
          <Field id="l4" label="Same-day order cutoff"><input id="l4" type="time" defaultValue="14:00" /></Field>
          <Num id="l5" label="Unpaid order expiry (hours)" value={6} />
          <Num id="l6" label="Quote valid for (days)" value={7} />
        </div>
      </section>

      <section className="card stack">
        <h2>Deposits &amp; balance</h2>
        <div className="adm-grid2">
          <Num id="d1" label="Deposit (%)" value={50} />
          <Num id="d2" label="Balance due (days before event)" value={2} />
          <Num id="d3" label="Full payment if event within (days)" value={3} />
          <Num id="d4" label="Cancellation fee (₱)" value={300} />
        </div>
      </section>

      <section className="card stack">
        <h2>Payment methods</h2>
        {methods.map((m, i) => (
          <div key={m.name} className="qrow">
            <div className="txt"><strong>{m.name}</strong><span>{m.note}</span></div>
            <Switch checked={m.on} label={`${m.name} active`} onChange={() => { setMethods(methods.map((x, j) => (j === i ? { ...x, on: !x.on } : x))); touch(); }} />
          </div>
        ))}
      </section>

      <section className="card flush">
        <h2 style={{ padding: "12px 0 0" }}>Delivery zones</h2>
        <table style={{ minWidth: 480 }}>
          <thead><tr><th scope="col">Zone</th><th scope="col">Areas</th><th scope="col" className="num">Fee</th><th scope="col">Delivers</th></tr></thead>
          <tbody>
            {zones.map((z, i) => (
              <tr key={z.name}>
                <td style={{ fontWeight: 600 }}>{z.name}</td><td style={{ color: "var(--muted)" }}>{z.areas}</td><td className="num">{z.fee}</td>
                <td><Switch checked={z.on} label={`${z.name} active`} onChange={() => { setZones(zones.map((x, j) => (j === i ? { ...x, on: !x.on } : x))); touch(); }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
