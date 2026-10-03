import { Check, MagnifyingGlass } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type Tone = "amber" | "blue" | "green" | "violet" | "red" | "grey";

export const peso = (n: number) => "₱" + n.toLocaleString("en-PH");

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`pill tone-${tone}`}>{children}</span>;
}

export function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={onChange} />;
}

export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="segmented">
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}

export function PageHead({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="adm-head">
      <div><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}</div>
      {children ? <div className="adm-tools">{children}</div> : null}
    </div>
  );
}

export function SearchBox({ id, label, placeholder, value, onChange }: { id: string; label: string; placeholder: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <div className="adm-search">
      <MagnifyingGlass size={16} color="#6b5d55" aria-hidden="true" />
      <label htmlFor={id} className="sr">{label}</label>
      <input id={id} type="search" placeholder={placeholder} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} />
    </div>
  );
}

export function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div className="fld"><label htmlFor={id}>{label}</label>{children}</div>;
}

/** Prototype toast: announces a message politely for a couple of seconds. */
export function useToast() {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 2600);
  }, []);
  const node = (
    <div role="status" aria-live="polite">
      {msg ? (
        <div className="toast">
          <Check size={18} weight="bold" aria-hidden="true" />
          {msg}
        </div>
      ) : null}
    </div>
  );
  return { show, node };
}

export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="dialog-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

/** Where an order number leads: the Orders list, filtered to that order. */
export const orderHref = (ref: string) => `/dashboard/orders?q=${encodeURIComponent(ref)}`;

const ORDER_REF = /\b((?:CK|OR)-\d{3,5})\b/g;

/** Text with every order number (CK-1039, OR-2214) turned into a link to that order. */
export function Linkify({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(ORDER_REF)) {
    const i = m.index ?? 0;
    if (i > last) parts.push(text.slice(last, i));
    parts.push(<Link key={i} to={orderHref(m[1]!)} className="ref-link">{m[1]}</Link>);
    last = i + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Generic status → tone helper keeps wording and colour in one place. */
export const STATUS_TONE: Record<string, Tone> = {
  review: "amber", pay: "blue", prod: "green", quote: "violet", alert: "red", done: "grey",
};
