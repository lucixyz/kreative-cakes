import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon } from "../components/Icons";
import { Spinner } from "../components/States";
import { useToast } from "../components/Toast";
import { CakeArt, type CakeArtProps } from "./CakeArt";

const COLORS: [string, string][] = [
  ["pink", "#f2a7bd"], ["blue", "#a9d6f0"], ["red", "#c0405f"], ["purple", "#a98bd6"], ["ube", "#a98bd6"],
  ["green", "#9bc27a"], ["matcha", "#9bc27a"], ["white", "#fbf3ee"], ["gold", "#e2b94d"], ["yellow", "#f6c445"],
  ["chocolate", "#6b4033"], ["black", "#22262e"],
];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
/** Things the catalog cannot make: the concept falls back and says so, instead of pretending. */
const UNAVAILABLE = [["swan", "Crystal swans"], ["crystal", "Crystal decorations"], ["hologram", "Hologram toppers"]] as const;

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
  const [generated, setGenerated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const generate = () => {
    if (!prompt.trim() && !photo) {
      toast.show("Describe your cake or upload an inspiration image first");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      const missing = UNAVAILABLE.find(([k]) => prompt.toLowerCase().includes(k));
      setWarning(missing ? `“${missing[1]}” aren’t available, so we used sugar flowers instead. You can change this in the Cake Builder.` : null);
      setConcept(conceptFromPrompt(prompt));
      setGenerated(true);
      setBusy(false);
    }, 900);
  };

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (!IMAGE_TYPES.includes(f.type) || f.size > MAX_IMAGE_BYTES) {
      toast.show("Image must be JPG, PNG or WebP under 10 MB");
      if (file.current) file.current.value = "";
      return;
    }
    setPhoto(f.name);
  };

  return (
    <section className="ai" id="ai-designer">
      <div className="ai-grid">
        <div className="stack">
          <span className="chip dark">AI Cake Designer</span>
          <h2>Imagine It. AI Designs It.</h2>
          <p className="muted">Describe your dream cake or upload an inspiration image, and get a design concept you can refine in 3D.</p>
          <label className="ai-prompt">
            <span className="sr">Describe your dream cake</span>
            <textarea rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your dream cake… e.g. a pink two-tier birthday cake with butterflies and sprinkles" />
          </label>
          {photo ? (
            <p className="muted file-chip">Inspiration attached: {photo} <button type="button" className="link-btn" onClick={() => { setPhoto(null); if (file.current) file.current.value = ""; }}>Remove</button></p>
          ) : null}
          <div className="row">
            <input ref={file} type="file" accept={IMAGE_TYPES.join(",")} hidden onChange={(e) => pick(e.target.files?.[0])} />
            <button className="pill outline-dark" onClick={() => file.current?.click()}>Upload Inspiration</button>
            <button className="pill solid-dark" onClick={generate} disabled={busy}>{busy ? "Generating…" : "Generate Design"}</button>
          </div>
          <p className="muted small-print">Demo preview. Final design and price are confirmed by our bakers.</p>
        </div>
        <div className="ai-preview" aria-live="polite">
          {busy ? (
            <Spinner title="Designing your cake…" text="Reading your theme, colors and guest count. This usually takes a few seconds." />
          ) : (
            <>
              {!generated ? <p className="muted small">Example concept. Describe your cake to see your own.</p> : null}
              <CakeArt {...concept} label="Generated cake concept" />
              {warning ? <p className="note" role="status">{warning}</p> : null}
              <Link to="/cake-builder" className="pill ghost">Customize in 3D <ArrowIcon /></Link>
              {generated ? <Link to="/submit-design" className="pill dark">Submit for bakery review <ArrowIcon /></Link> : null}
            </>
          )}
        </div>
      </div>
      {toast.node}
    </section>
  );
}
