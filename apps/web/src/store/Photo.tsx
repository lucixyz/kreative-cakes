import { useState, type ReactNode } from "react";

// Image slots in apps/web/public/images/. Each slot tries a real photo (.jpg) first, then the generated
// illustration (.svg, see scripts/generate-cake-art.mjs), then the drawn cake component.
// Real photography: drop JPGs at these paths (ideally 4:5, soft daylight, plain background):
//   hero.jpg                      the homepage hero
//   products/<product-slug>.jpg   one per cake, e.g. products/strawberry-chiffon-dream.jpg
//   occasions/<key>.jpg           birthday | wedding | anniversary | corporate | cupcakes | bento
// Illustrations are captioned so they are never mistaken for the bakery's real products.
const BASE = "/images";
export const heroPhoto = `${BASE}/hero`;
export const productPhoto = (slug: string) => `${BASE}/products/${slug}`;
export const occasionPhoto = (key: string) => `${BASE}/occasions/${key}`;

const EXTENSIONS = ["jpg", "svg"] as const;

export function Photo({ src, alt, fallback, caption = true, className = "" }: { src: string; alt: string; fallback: ReactNode; caption?: boolean; className?: string }) {
  const [attempt, setAttempt] = useState(0); // index into EXTENSIONS; EXTENSIONS.length = nothing found
  const [loaded, setLoaded] = useState(false);
  const ext = EXTENSIONS[attempt];
  return (
    <div className={`photo ${className}`}>
      {!loaded ? fallback : null}
      {ext ? (
        <img key={ext} src={`${src}.${ext}`} alt={alt} loading="lazy" decoding="async" className={loaded ? "on" : ""} onLoad={() => setLoaded(true)} onError={() => setAttempt(attempt + 1)} />
      ) : null}
      {caption && (!loaded || ext === "svg") ? <span className="photo-note">{loaded ? "Illustration" : "Sample artwork"}</span> : null}
    </div>
  );
}
