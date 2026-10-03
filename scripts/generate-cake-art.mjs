// Generates the storefront's original cake illustrations (SVG) into apps/web/public/images/.
// Run: node scripts/generate-cake-art.mjs
// These are illustrations, not photographs. One lighting model (soft light from upper left), one
// table surface and one camera height keep every image consistent. Real photos placed at the same
// paths with a .jpg extension take precedence (see apps/web/src/store/Photo.tsx).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "apps", "web", "public", "images");

// ---------- helpers ----------
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => `#${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const f = (n) => Math.round(n * 10) / 10;

function defs(id, color) {
  return `<defs>
  <linearGradient id="body-${id}" x1="0" x2="1"><stop offset="0" stop-color="${mix(color, "#000000", 0.14)}"/><stop offset="0.35" stop-color="${mix(color, "#ffffff", 0.1)}"/><stop offset="1" stop-color="${mix(color, "#000000", 0.18)}"/></linearGradient>
  <radialGradient id="light-${id}" cx="0.22" cy="0.12" r="0.9"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  <linearGradient id="table-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.25"/></linearGradient>
</defs>`;
}

function backdrop(id, w, h, tone, horizon) {
  return `<rect width="${w}" height="${h}" fill="${tone}"/>
<rect y="${horizon}" width="${w}" height="${h - horizon}" fill="${mix(tone, "#ffffff", 0.35)}"/>
<rect y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#table-${id})"/>
<rect width="${w}" height="${h}" fill="url(#light-${id})"/>`;
}

const plate = (cx, y, rx) => `<ellipse cx="${cx}" cy="${y + 26}" rx="${rx + 18}" ry="${rx * 0.12}" fill="#2a201922"/>
<ellipse cx="${cx}" cy="${y + 12}" rx="${rx + 14}" ry="${rx * 0.11}" fill="#e9e1d8"/>
<ellipse cx="${cx}" cy="${y + 4}" rx="${rx + 14}" ry="${rx * 0.11}" fill="#fbf8f4"/>`;

// A tier: body, drips, top surface. Returns { svg, topY }.
function tier(id, cx, bottom, w, h, color, { drip = true, seed = 1, band = null } = {}) {
  const r = rng(seed);
  const ry = w * 0.075;
  const top = bottom - h;
  const topColor = mix(color, "#ffffff", 0.38);
  const clip = `clip-${id}-${seed}`;
  let drips = "";
  if (drip) {
    const n = Math.max(5, Math.round(w / 38));
    for (let i = 0; i < n; i++) {
      const x = cx - w / 2 + 18 + (i * (w - 36)) / (n - 1);
      const len = 18 + r() * Math.min(60, h * 0.5);
      drips += `<rect x="${f(x - 11)}" y="${f(top)}" width="22" height="${f(len)}" rx="11" fill="${topColor}"/>`;
    }
  }
  const svg = `<g>
  <clipPath id="${clip}"><rect x="${cx - w / 2}" y="${top}" width="${w}" height="${h + ry}" rx="12"/></clipPath>
  <rect x="${cx - w / 2}" y="${top}" width="${w}" height="${h}" rx="12" fill="url(#body-${id})"/>
  <ellipse cx="${cx}" cy="${bottom}" rx="${w / 2}" ry="${ry}" fill="${mix(color, "#000000", 0.08)}" clip-path="url(#${clip})"/>
  <g clip-path="url(#${clip})">${drips}</g>
  ${band ? `<rect x="${cx - w / 2}" y="${bottom - 22}" width="${w}" height="10" fill="${band}" opacity="0.9"/>` : ""}
  <ellipse cx="${cx}" cy="${top}" rx="${w / 2}" ry="${ry}" fill="${topColor}"/>
  <ellipse cx="${cx - w * 0.12}" cy="${top - ry * 0.25}" rx="${w * 0.2}" ry="${ry * 0.3}" fill="#ffffff" opacity="0.35"/>
</g>`;
  return { svg, top, ry };
}

// ---------- toppings ----------
const rosette = (x, y, r, c) => `<g><circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${c}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.66)}" fill="${mix(c, "#000000", 0.08)}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.34)}" fill="${mix(c, "#ffffff", 0.25)}"/></g>`;
const strawberry = (x, y, s) => `<g><ellipse cx="${f(x)}" cy="${f(y)}" rx="${s}" ry="${f(s * 1.15)}" fill="#d63a4a"/><ellipse cx="${f(x - s * 0.3)}" cy="${f(y - s * 0.3)}" rx="${f(s * 0.25)}" ry="${f(s * 0.4)}" fill="#ffffff" opacity="0.3"/><path d="M${f(x - s * 0.7)} ${f(y - s * 0.9)} q${f(s * 0.7)} ${f(-s * 0.6)} ${f(s * 1.4)} 0 q${f(-s * 0.7)} ${f(s * 0.35)} ${f(-s * 1.4)} 0z" fill="#4d8a3c"/></g>`;
const blueberry = (x, y, s) => `<g><circle cx="${f(x)}" cy="${f(y)}" r="${s}" fill="#41508f"/><circle cx="${f(x - s * 0.3)}" cy="${f(y - s * 0.3)}" r="${f(s * 0.28)}" fill="#ffffff" opacity="0.35"/><circle cx="${f(x + s * 0.1)}" cy="${f(y - s * 0.1)}" r="${f(s * 0.14)}" fill="#2a3466"/></g>`;
const pearl = (x, y, s) => `<circle cx="${f(x)}" cy="${f(y)}" r="${s}" fill="#fffaf2" stroke="#e1d6c8"/>`;
const wing = (x, y, s, c, flip) => `<g transform="translate(${f(x)} ${f(y)}) scale(${flip ? -1 : 1} 1)"><ellipse cx="${f(s * 0.6)}" cy="${f(-s * 0.35)}" rx="${f(s * 0.62)}" ry="${f(s * 0.42)}" transform="rotate(-24 ${f(s * 0.6)} ${f(-s * 0.35)})" fill="${c}"/><ellipse cx="${f(s * 0.5)}" cy="${f(s * 0.35)}" rx="${f(s * 0.44)}" ry="${f(s * 0.3)}" transform="rotate(22 ${f(s * 0.5)} ${f(s * 0.35)})" fill="${mix(c, "#000000", 0.1)}"/></g>`;
const butterfly = (x, y, s, c) => `<g>${wing(x, y, s, c, false)}${wing(x, y, s, c, true)}<rect x="${f(x - 2)}" y="${f(y - s * 0.5)}" width="4" height="${f(s * 0.9)}" rx="2" fill="${mix(c, "#000000", 0.45)}"/></g>`;
const candle = (x, y, c) => `<g><rect x="${x - 6}" y="${y - 52}" width="12" height="52" rx="3" fill="${c}"/><path d="M${x} ${y - 78} q9 14 0 24 q-9 -10 0 -24z" fill="#f6b73c"/></g>`;
const sprinkles = (cx, y, w, seed) => {
  const r = rng(seed);
  const cols = ["#ffffff", "#f6c445", "#6fb7e9", "#e85d8a", "#8fd18f"];
  return Array.from({ length: 26 }, () => {
    const x = cx + (r() - 0.5) * w * 0.8;
    const yy = y + (r() - 0.5) * 18;
    return `<rect x="${f(x)}" y="${f(yy)}" width="12" height="4" rx="2" fill="${cols[Math.floor(r() * cols.length)]}" transform="rotate(${Math.floor(r() * 180)} ${f(x)} ${f(yy)})"/>`;
  }).join("");
};

// ---------- compositions ----------
// Scale a scene about its ground point so the cake fills the frame (portrait vs landscape).
const zoomOf = (W) => (W <= 800 ? 1.3 : 1.4);
const zoomed = (W, cx, ground, inner) => `<g transform="translate(${cx} ${ground}) scale(${zoomOf(W)}) translate(${-cx} ${-ground})">${inner}</g>`;
function wholeCake(spec, W = 800, H = 1000) {
  const { id, tiers, color, tone, deco, seed = 3, band } = spec;
  const cx = W / 2;
  const ground = H * (W <= 800 ? 0.84 : 0.86);
  const widths = [440, 320, 220].slice(0, tiers).map((w) => (tiers === 1 ? 460 : w));
  const heights = tiers === 1 ? [210] : tiers === 2 ? [180, 150] : [150, 130, 110];
  let y = ground;
  let out = "";
  const tops = [];
  for (let i = 0; i < tiers; i++) {
    const t = tier(id, cx, y, widths[i], heights[i], color, { drip: spec.drip ?? true, seed: seed + i, band });
    out += t.svg;
    tops.push({ y: t.top, ry: t.ry, w: widths[i] });
    y = t.top;
  }
  const top = tops[tops.length - 1];
  let extra = "";
  const ring = (t, n, make, inset = 0.4) => Array.from({ length: n }, (_, i) => {
    const a = Math.PI + (i * Math.PI) / (n - 1);
    return make(cx + Math.cos(a) * t.w * inset, t.y + Math.sin(a) * t.ry * 0.5 + 6, i);
  }).join("");
  if (deco === "strawberry") {
    extra = ring(top, 5, (x, yy) => strawberry(x, yy - 8, 20)) + rosette(cx, top.y - 4, 22, "#ffffff") + ring(tops[0], 7, (x, yy) => rosette(x, yy + 10, 12, "#ffffff"), 0.46);
  } else if (deco === "chocolate") {
    extra = [-60, -20, 20, 60].map((dx, i) => `<rect x="${cx + dx - 6}" y="${top.y - 44 + (i % 2) * 8}" width="12" height="44" rx="3" fill="#2d1a15" transform="rotate(${(i - 1.5) * 14} ${cx + dx} ${top.y})"/>`).join("") + ring(top, 4, (x, yy) => strawberry(x, yy - 10, 16));
  } else if (deco === "ube") {
    extra = ring(top, 6, (x, yy) => rosette(x, yy, 18, mix(color, "#ffffff", 0.2))) + `<path d="M${cx - 60} ${top.y - 6} q20 -30 40 0 t40 0 t40 0" stroke="#fffaf2" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  } else if (deco === "wedding") {
    extra = tops.map((t) => ring(t, 9, (x, yy) => pearl(x, yy + t.ry * 0.9 + 6, 6), 0.49)).join("") + rosette(cx - 30, top.y - 8, 20, "#ffffff") + rosette(cx + 24, top.y - 12, 24, "#f7dce2") + rosette(cx + 2, top.y - 28, 16, "#ffffff");
  } else if (deco === "mango") {
    extra = [-70, -24, 22, 66].map((dx, i) => `<path d="M${cx + dx - 28} ${top.y} q28 -48 56 0z" fill="${i % 2 ? "#f4b13a" : "#f8c24e"}" transform="rotate(${(i - 1.5) * 8} ${cx + dx} ${top.y})"/>`).join("") + `<path d="M${cx + 90} ${top.y - 2} q14 -30 -4 -40 q-4 24 4 40z" fill="#4d8a3c"/>`;
  } else if (deco === "velvet") {
    extra = ring(top, 7, (x, yy) => rosette(x, yy, 15, "#fff6ee")) + [-30, 0, 30].map((dx) => `<circle cx="${cx + dx}" cy="${top.y - 6}" r="9" fill="#8f1d31"/>`).join("");
  } else if (deco === "caramel") {
    extra = `<path d="M${cx - 150} ${top.y} q40 24 80 0 t80 0 t80 0 t80 0" stroke="#b9772c" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.9"/>` + [-60, 0, 60].map((dx, i) => `<rect x="${cx + dx - 18}" y="${top.y - 30}" width="36" height="12" rx="6" fill="#c98a3a" transform="rotate(${(i - 1) * 24} ${cx + dx} ${top.y - 24})"/>`).join("");
  } else if (deco === "birthday") {
    extra = sprinkles(cx, top.y, top.w, seed) + [-50, 0, 50].map((dx, i) => candle(cx + dx, top.y, ["#ffffff", "#f6c445", "#6fb7e9"][i])).join("");
  } else if (deco === "hero") {
    extra = ring(tops[0], 5, (x, yy) => butterfly(x, yy - 70, 30, "#c9a24a"), 0.4) + ring(tops[1], 4, (x, yy) => butterfly(x, yy - 56, 26, "#c9a24a"), 0.36) + [-50, 0, 50].map((dx, i) => rosette(cx + dx, top.y - 6 - (i === 1 ? 14 : 0), 20, i === 1 ? "#ffffff" : "#f7dce2")).join("") + ring(tops[0], 8, (x, yy) => rosette(x, yy + 8, 11, "#ffffff"), 0.47);
  } else if (deco === "corporate") {
    extra = `<rect x="${cx - 110}" y="${top.y + 24}" width="220" height="56" rx="8" fill="#fffaf2" opacity="0.92"/><rect x="${cx - 90}" y="${top.y + 46}" width="180" height="10" rx="5" fill="${mix(color, "#000000", 0.3)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${spec.label}">
${defs(id, color)}
${backdrop(id, W, H, tone, ground - 40)}
${zoomed(W, cx, ground, plate(cx, ground, widths[0] / 2) + out + extra)}
</svg>`;
}

function cupcakes(spec, W = 800, H = 1000) {
  const { id, color, tone } = spec;
  const ground = H * 0.8;
  const cup = (cx, base, s, frost) => `<g>
  <ellipse cx="${cx}" cy="${base + 8}" rx="${s * 0.62}" ry="${s * 0.1}" fill="#2a201922"/>
  <path d="M${cx - s * 0.5} ${base - s * 0.62} L${cx - s * 0.38} ${base} h${s * 0.76} L${cx + s * 0.5} ${base - s * 0.62}z" fill="#f2ece4" stroke="#e1d6c8"/>
  ${[-0.3, -0.1, 0.1, 0.3].map((k) => `<line x1="${f(cx + s * k)}" y1="${f(base - s * 0.6)}" x2="${f(cx + s * k * 0.8)}" y2="${f(base - 4)}" stroke="#e1d6c8"/>`).join("")}
  <path d="M${cx - s * 0.54} ${base - s * 0.6} q${s * 0.54} -${s * 0.2} ${s * 1.08} 0 q-${s * 0.08} -${s * 0.34} -${s * 0.3} -${s * 0.4} q-${s * 0.02} -${s * 0.3} -${s * 0.24} -${s * 0.38} q-${s * 0.22} ${s * 0.08} -${s * 0.24} ${s * 0.38} q-${s * 0.22} ${s * 0.06} -${s * 0.3} ${s * 0.4}z" fill="${frost}"/>
  ${blueberry(cx, base - s * 1.18, s * 0.12)}
</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${spec.label}">
${defs(id, color)}
${backdrop(id, W, H, tone, ground - 40)}
${zoomed(W, W / 2, ground + 36, cup(W / 2 - 150, ground, 200, mix(color, "#ffffff", 0.2)) + cup(W / 2 + 150, ground, 200, mix(color, "#ffffff", 0.2)) + cup(W / 2, ground + 36, 230, color))}
</svg>`;
}

function bento(spec, W = 800, H = 1000) {
  const { id, color, tone } = spec;
  const cx = W / 2;
  const ground = H * 0.76;
  const t = tier(id, cx, ground, 300, 170, color, { seed: 9 });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${spec.label}">
${defs(id, color)}
${backdrop(id, W, H, tone, ground - 50)}
${zoomed(W, cx, ground + 90, `<rect x="${cx - 190}" y="${ground - 30}" width="380" height="120" rx="10" fill="#fbf8f4" stroke="#e1d6c8"/>
<rect x="${cx - 190}" y="${ground - 30}" width="380" height="22" fill="#efe7dd"/>
${t.svg}
${sprinkles(cx, t.top, 300, 4)}
${strawberry(cx, t.top - 10, 22)}`)}
</svg>`;
}

// ---------- specs ----------
const PRODUCTS = [
  { slug: "strawberry-chiffon-dream", id: "p1", tiers: 2, color: "#f4b6c6", tone: "#efe3e1", deco: "strawberry", label: "Illustration of a two-tier strawberry chiffon cake" },
  { slug: "dark-chocolate-ganache", id: "p2", tiers: 2, color: "#4a2e26", tone: "#e6dfd3", deco: "chocolate", label: "Illustration of a two-tier dark chocolate ganache cake" },
  { slug: "ube-macapuno-layer-cake", id: "p3", tiers: 2, color: "#a98bd6", tone: "#e6e0ec", deco: "ube", label: "Illustration of a two-tier ube cake" },
  { slug: "classic-two-tier-vanilla", id: "p4", tiers: 3, color: "#fbf3ee", tone: "#ece4d8", deco: "wedding", drip: false, label: "Illustration of a three-tier white celebration cake" },
  { slug: "mango-cream-torte", id: "p5", tiers: 1, color: "#f6d27a", tone: "#f1e6cc", deco: "mango", label: "Illustration of a mango cream torte" },
  { slug: "red-velvet-classic", id: "p6", tiers: 2, color: "#b3263e", tone: "#efe1e0", deco: "velvet", label: "Illustration of a two-tier red velvet cake" },
  { slug: "matcha-bento-cake", id: "p7", tiers: 1, color: "#9bc27a", tone: "#e4e6dc", kind: "bento", label: "Illustration of a matcha bento cake in a box" },
  { slug: "salted-caramel-crunch", id: "p8", tiers: 2, color: "#d9a35b", tone: "#eadfd6", deco: "caramel", label: "Illustration of a two-tier salted caramel cake" },
  { slug: "lemon-blueberry-cupcakes", id: "p9", tiers: 1, color: "#f4e3a1", tone: "#e6e8ee", kind: "cupcakes", label: "Illustration of lemon blueberry cupcakes" },
];
const OCCASIONS = [
  { slug: "birthday", id: "o1", tiers: 2, color: "#f2a7bd", tone: "#efe3e1", deco: "birthday", label: "Illustration of a birthday cake" },
  { slug: "wedding", id: "o2", tiers: 3, color: "#fbf3ee", tone: "#ece4d8", deco: "wedding", drip: false, label: "Illustration of a wedding cake" },
  { slug: "anniversary", id: "o3", tiers: 2, color: "#a98bd6", tone: "#e6e0ec", deco: "ube", label: "Illustration of an anniversary cake" },
  { slug: "corporate", id: "o4", tiers: 1, color: "#9bc27a", tone: "#e3e5db", deco: "corporate", drip: false, label: "Illustration of a corporate event cake" },
  { slug: "cupcakes", id: "o5", tiers: 1, color: "#f4c9d3", tone: "#eadfd6", kind: "cupcakes", label: "Illustration of cupcakes" },
  { slug: "bento", id: "o6", tiers: 1, color: "#e8a3b4", tone: "#e6ddd0", kind: "bento", label: "Illustration of a bento cake" },
];

const render = (s, W, H) => (s.kind === "cupcakes" ? cupcakes(s, W, H) : s.kind === "bento" ? bento(s, W, H) : wholeCake(s, W, H));

mkdirSync(join(OUT, "products"), { recursive: true });
mkdirSync(join(OUT, "occasions"), { recursive: true });
for (const p of PRODUCTS) writeFileSync(join(OUT, "products", `${p.slug}.svg`), render(p, 800, 1000));
// Occasion tiles are 3:2: same scene, wider canvas.
for (const o of OCCASIONS) writeFileSync(join(OUT, "occasions", `${o.slug}.svg`), render(o, 1200, 800));
console.log(`Wrote ${PRODUCTS.length + OCCASIONS.length} images to ${OUT}`);
