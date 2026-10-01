import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CakeArt, type CakeArtProps } from "./CakeArt";

const COLORS: [string, string][] = [
  ["pink", "#f2a7bd"], ["blue", "#a9d6f0"], ["red", "#c0405f"], ["purple", "#a98bd6"], ["ube", "#a98bd6"],
  ["green", "#9bc27a"], ["matcha", "#9bc27a"], ["white", "#fbf3ee"], ["gold", "#e2b94d"], ["yellow", "#f6c445"],
  ["chocolate", "#6b4033"], ["black", "#22262e"],
];

/** DEMO ONLY: maps keywords in the prompt to a concept. The real AI provider replaces this later. */
function conceptFromPrompt(prompt: string): CakeArtProps {
  const p = prompt.toLowerCase();
  const color = COLORS.find(([k]) => p.includes(k))?.[1] ?? "#f2a7bd";
  const tiers = /wedding|three|3[- ]tier|tall/.test(p) ? 3 : /two|2[- ]tier|anniversary/.test(p) ? 2 : /small|mini|single|one/.test(p) ? 1 : 2;
  const topper = /butterfl/.test(p) ? "butterfly" : /flower|floral|rose/.test(p) ? "flowers" : /birthday|candle/.test(p) ? "candles" : "none";
  return { tiers: tiers as 1 | 2 | 3, color, topper, sprinkles: /sprinkle|confetti|rainbow/.test(p), drip: !/no drip|minimal|plain/.test(p) };
}

export function AiDesigner() {
  const [prompt, setPrompt] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [concept, setConcept] = useState<CakeArtProps>({ tiers: 2, color: "#f2a7bd", topper: "butterfly" });
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const generate = () => {
    setBusy(true);
    window.setTimeout(() => {
      setConcept(conceptFromPrompt(prompt));
      setBusy(false);
    }, 700);
  };

  return (
    <section className="ai" id="ai-designer">
      <div className="ai-grid">
        <div className="stack">
          <span className="chip dark">✨ AI Cake Designer</span>
          <h2>Imagine It. AI Designs It.</h2>
          <p className="muted">Describe your dream cake or upload an inspiration image, and get a design concept you can refine in 3D.</p>
          <label className="ai-prompt">
            <span className="sr">Describe your dream cake</span>
            <textarea rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your dream cake… e.g. a pink two-tier birthday cake with butterflies and sprinkles" />
          </label>
          {photo ? <p className="muted">Inspiration attached: {photo}</p> : null}
          <div className="row">
            <input ref={file} type="file" accept="image/*" hidden onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? null)} />
            <button className="pill outline-dark" onClick={() => file.current?.click()}>Upload Inspiration</button>
            <button className="pill solid-dark" onClick={generate} disabled={busy}>{busy ? "Generating…" : "Generate Design"}</button>
          </div>
          <p className="muted small-print">Demo preview. Final design and price are confirmed by our bakers.</p>
        </div>
        <div className="ai-preview">
          <CakeArt {...concept} label="Generated cake concept" />
          <Link to="/cake-builder" className="pill ghost">Customize in 3D →</Link>
        </div>
      </div>
    </section>
  );
}
