import { useState } from "react";
import { Link } from "react-router-dom";
import { CakeArt } from "./CakeArt";
import { SectionHead } from "./SectionHead";

const FROSTING_COLORS = ["#f2a7bd", "#fbf3ee", "#c0405f", "#a98bd6", "#a9d6f0", "#9bc27a", "#f6c445", "#6b4033", "#22262e"];
const FLAVORS = ["Chocolate", "Vanilla", "Red Velvet", "Ube", "Strawberry", "Mocha"];
const FILLINGS = ["Cream cheese", "Chocolate ganache", "Fresh fruit", "Custard"];
const TOPPERS = ["none", "candles", "flowers", "butterfly"] as const;

function Choice<T extends string | number>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset className="ctl">
      <legend>{label}</legend>
      <div className="row tight">
        {options.map((o) => (
          <button key={String(o)} type="button" className={`opt${o === value ? " on" : ""}`} aria-pressed={o === value} onClick={() => onChange(o)}>
            {typeof o === "string" ? o[0]!.toUpperCase() + o.slice(1) : o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Customizer() {
  const [tiers, setTiers] = useState<1 | 2 | 3>(2);
  const [shape, setShape] = useState<"round" | "square">("round");
  const [color, setColor] = useState("#f2a7bd");
  const [flavor, setFlavor] = useState("Chocolate");
  const [filling, setFilling] = useState("Cream cheese");
  const [drip, setDrip] = useState(true);
  const [sprinkles, setSprinkles] = useState(false);
  const [topper, setTopper] = useState<(typeof TOPPERS)[number]>("flowers");
  const [message, setMessage] = useState("Happy Birthday");

  return (
    <section id="customizer">
      <SectionHead title="Build Your Own Cake" sub="Choose every detail and watch your cake update." />
      <div className="custom-grid">
        <div className="controls">
          <Choice label="Tiers" options={[1, 2, 3] as const} value={tiers} onChange={setTiers} />
          <Choice label="Shape" options={["round", "square"] as const} value={shape} onChange={setShape} />
          <fieldset className="ctl">
            <legend>Frosting color</legend>
            <div className="row tight">
              {FROSTING_COLORS.map((c) => (
                <button key={c} type="button" className={`dot${c === color ? " on" : ""}`} style={{ background: c }} aria-label={`Color ${c}`} aria-pressed={c === color} onClick={() => setColor(c)} />
              ))}
            </div>
          </fieldset>
          <Choice label="Flavor" options={FLAVORS} value={flavor} onChange={setFlavor} />
          <Choice label="Filling" options={FILLINGS} value={filling} onChange={setFilling} />
          <fieldset className="ctl">
            <legend>Decorations</legend>
            <div className="row tight">
              <button type="button" className={`opt${drip ? " on" : ""}`} aria-pressed={drip} onClick={() => setDrip(!drip)}>Drip</button>
              <button type="button" className={`opt${sprinkles ? " on" : ""}`} aria-pressed={sprinkles} onClick={() => setSprinkles(!sprinkles)}>Sprinkles</button>
            </div>
          </fieldset>
          <Choice label="Topper" options={TOPPERS} value={topper} onChange={setTopper} />
          <label className="ctl">
            <span className="legend">Message on cake</span>
            <input type="text" maxLength={18} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
        </div>

        <div className="custom-preview">
          <CakeArt tiers={tiers} shape={shape} color={color} drip={drip} sprinkles={sprinkles} topper={topper} message={message} label="Your custom cake" />
          <p className="muted">{tiers}-tier {shape} · {flavor} · {filling} filling</p>
          <Link to="/cake-builder" className="pill solid-dark">Start Customizing</Link>
          <p className="muted small-print">Preview only. The bakery confirms feasibility and the final price.</p>
        </div>
      </div>
    </section>
  );
}
