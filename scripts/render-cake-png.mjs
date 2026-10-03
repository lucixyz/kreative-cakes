// Renders the generated cake illustrations (apps/web/public/images/**.svg) to PNG for the mobile app
// (apps/customer/assets/images/), since React Native cannot draw SVG files without extra native code.
// Run after scripts/generate-cake-art.mjs:  node scripts/render-cake-png.mjs
// Uses the installed Microsoft Edge through playwright-core (BROWSER_CHANNEL=chrome to use Chrome).
import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";

const SRC = join(import.meta.dirname, "..", "apps", "web", "public", "images");
const OUT = join(import.meta.dirname, "..", "apps", "customer", "assets", "images");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? "msedge" });
const page = await browser.newPage({ deviceScaleFactor: 1 });
// hero and the nine products are 4:5; occasion images are not needed on mobile.
const jobs = [["hero", join(SRC, "hero.svg")], ...readdirSync(join(SRC, "products")).map((f) => [f.replace(".svg", ""), join(SRC, "products", f)])];
for (const [name, file] of jobs) {
  const svg = readFileSync(file, "utf8");
  await page.setViewportSize({ width: 600, height: 750 });
  await page.setContent(`<body style="margin:0">${svg.replace("<svg ", '<svg width="600" height="750" ')}</body>`);
  await page.screenshot({ path: join(OUT, `${name}.png`) });
}
await browser.close();
console.log(`Rendered ${jobs.length} PNGs to ${OUT}`);
