import { useSession } from "@cakeshop/auth/react";
import { useState } from "react";
import { Dialog } from "../../components/Dialog";
import { useToast } from "../../components/Toast";

type Tab = "profile" | "addresses" | "notifications" | "security";
const TABS: [Tab, string][] = [["profile", "Profile"], ["addresses", "Addresses"], ["notifications", "Notifications"], ["security", "Security"]];
type Address = { label: string; line: string; def: boolean };

function Input({ id, label, ...rest }: { id: string; label: string } & React.ComponentProps<"input">) {
  return <div className="field"><label htmlFor={id}>{label}</label><input id={id} {...rest} /></div>;
}

export function Settings() {
  const session = useSession();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("profile");
  const [addrs, setAddrs] = useState<Address[]>([{ label: "Home", line: "[House no., street, barangay, city]", def: true }, { label: "Office", line: "[Company address]", def: false }]);
  const [editing, setEditing] = useState(-1);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const patch = (i: number, p: Partial<Address>) => setAddrs(addrs.map((a, j) => (j === i ? { ...a, ...p } : a)));

  return (
    <>
      <h1>Account settings</h1>
      <div role="group" aria-label="Settings sections" className="tabs">
        {TABS.map(([id, label]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}
      </div>

      {tab === "profile" ? (
        <form className="card two-col" onSubmit={(e) => { e.preventDefault(); toast.show("Changes saved"); }}>
          <Input id="pn" label="Full name" type="text" defaultValue={session?.user.displayName ?? ""} />
          <Input id="pe" label="Email" type="email" defaultValue={session?.user.email ?? ""} />
          <Input id="pp" label="Mobile number" type="tel" defaultValue="0917 123 4567" />
          <Input id="pb" label="Birthday (for birthday treats)" type="date" />
          <div className="span-all"><button type="submit" className="pill dark">Save changes</button></div>
        </form>
      ) : null}

      {tab === "addresses" ? (
        <section className="stack">
          {addrs.map((a, i) => (
            <div key={i} className="card stack">
              {editing === i ? (
                <>
                  <div className="two-col">
                    <Input id={`al${i}`} label="Label" type="text" value={a.label} onChange={(e) => patch(i, { label: e.target.value })} />
                    <Input id={`aa${i}`} label="Address" type="text" value={a.line} onChange={(e) => patch(i, { line: e.target.value })} />
                  </div>
                  <div><button type="button" className="pill dark" onClick={() => { setEditing(-1); toast.show("Address saved"); }}>Save address</button></div>
                </>
              ) : (
                <div className="addr-row">
                  <div><strong>{a.label}</strong>{a.def ? <span className="avail today small-tag">Default</span> : null}<p className="muted">{a.line || "No address yet"}</p></div>
                  <div className="row tight">
                    <button type="button" className="pill outline-dark small" onClick={() => setEditing(i)}>Edit</button>
                    {!a.def ? (
                      <>
                        <button type="button" className="pill outline-dark small" onClick={() => { setAddrs(addrs.map((x, j) => ({ ...x, def: j === i }))); toast.show(`${a.label} is now your default address`); }}>Make default</button>
                        <button type="button" className="pill outline-dark small danger" onClick={() => { setAddrs(addrs.filter((_, j) => j !== i)); setEditing(-1); toast.show("Address removed"); }}>Remove</button>
                      </>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div><button type="button" className="pill outline-dark" onClick={() => { setAddrs([...addrs, { label: "New address", line: "", def: false }]); setEditing(addrs.length); }}>Add address</button></div>
        </section>
      ) : null}

      {tab === "notifications" ? (
        <section className="card toggles">
          {[["Order status updates", true], ["Quotation and payment reminders", true], ["New messages from the bakery", true], ["Promotions and new cakes", false]].map(([label, on]) => (
            <label key={label as string} className="toggle-row">{label as string}<input type="checkbox" defaultChecked={on as boolean} onChange={() => toast.show("Preference saved")} /></label>
          ))}
        </section>
      ) : null}

      {tab === "security" ? (
        <section className="card stack">
          <form className="stack" onSubmit={(e) => { e.preventDefault(); toast.show("Password change isn’t connected in this prototype yet"); }}>
            <Input id="op" label="Current password" type="password" autoComplete="current-password" />
            <Input id="np" label="New password" type="password" autoComplete="new-password" />
            <div><button type="submit" className="pill dark">Update password</button></div>
          </form>
          <div className="delete-row">
            <div><strong>Delete account</strong><p className="muted">Removes your data under our Privacy Policy. Active orders must be completed first.</p></div>
            <button type="button" className="pill outline-dark danger" onClick={() => setConfirmDelete(true)}>Request deletion</button>
          </div>
        </section>
      ) : null}

      {confirmDelete ? (
        <Dialog title="Delete your account?" onClose={() => setConfirmDelete(false)}>
          <p className="muted">We’ll remove your profile, saved designs and messages. Order records we must keep for tax purposes are kept as required by law. This can’t be undone.</p>
          <div className="row tight end">
            <button type="button" className="pill ghost" onClick={() => setConfirmDelete(false)}>Keep my account</button>
            <button type="button" className="pill dark danger-fill" onClick={() => { setConfirmDelete(false); toast.show("Deletion request noted. We’ll email you within 7 days."); }}>Request deletion</button>
          </div>
        </Dialog>
      ) : null}
      {toast.node}
    </>
  );
}
