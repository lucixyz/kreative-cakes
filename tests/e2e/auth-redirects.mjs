// Browser E2E for customer/admin auth separation, in real Edge/Chrome.
// Serves builds of the Vite sites (apps/web, apps/admin), each on its OWN origin (as they are
// isolated in production). Built with VITE_ALLOW_MOCK_AUTH=true because production builds refuse
// to run the mock auth service.
// Run: pnpm e2e:auth   (BROWSER_CHANNEL=chrome to use Chrome instead of Edge)
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = join(fileURLToPath(import.meta.url), "..", "..", "..");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".css": "text/css", ".ico": "image/x-icon", ".ttf": "font/ttf", ".map": "application/json" };
const PASSWORD = "Prototype#12345";

const isFile = (f) => { try { return statSync(f).isFile(); } catch { return false; } };

async function serveDir(dir) {
  const server = createServer((req, res) => {
    const rel = normalize(new URL(req.url, "http://x").pathname).replace(/^([/\\])+/, "");
    let file = join(dir, rel);
    if (!file.startsWith(dir) || !isFile(file)) file = join(dir, "index.html"); // SPA fallback
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  await new Promise((r) => server.listen(0, r));
  return { server, base: `http://localhost:${server.address().port}` };
}

if (!process.env.SKIP_BUILD) {
  // Production builds refuse the mock auth service unless VITE_ALLOW_MOCK_AUTH=true.
  for (const [app, env] of [["web", { VITE_ALLOW_MOCK_AUTH: "true" }], ["admin", { VITE_ALLOW_MOCK_AUTH: "true" }]]) {
    const r = spawnSync(`pnpm --filter @cakeshop/${app} build`, { cwd: root, shell: true, stdio: "ignore", env: { ...process.env, ...env } });
    if (r.status !== 0) throw new Error(`Building ${app} failed`);
  }
}

const customer = await serveDir(join(root, "apps/web/dist"));
const admin = await serveDir(join(root, "apps/admin/dist"));
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? "msedge" });

let failed = 0;
async function scenario(name, fn) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await fn(page, context);
    console.log(`PASS  ${name}`);
  } catch (err) {
    failed++;
    console.log(`FAIL  ${name}\n      ${err.message.split("\n")[0]}  (url: ${page.url()})`);
  } finally {
    await context.close();
  }
}

const path = (page) => new URL(page.url()).pathname;
const settle = (page, p) => page.waitForURL((u) => u.pathname === p, { timeout: 15000 });

async function login(page, email, button = "Log in") {
  await page.getByLabel("Email", { exact: false }).first().fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: button }).click();
}

await scenario("admin: unauthenticated / -> login", async (page) => {
  await page.goto(`${admin.base}/`);
  await settle(page, "/login");
  await page.getByText("Staff sign in").waitFor();
});

await scenario("admin: unauthenticated /dashboard/orders -> login", async (page) => {
  await page.goto(`${admin.base}/dashboard/orders`);
  await settle(page, "/login");
});

await scenario("admin login has no signup link and /signup is not a signup page", async (page) => {
  await page.goto(`${admin.base}/login`);
  await page.getByText("Staff sign in").waitFor();
  assert.equal(await page.getByText(/create an account|sign up/i).count(), 0);
  await page.goto(`${admin.base}/signup`);
  await page.getByText("Page not found").waitFor();
  assert.equal(await page.getByLabel("Confirm password").count(), 0);
});

await scenario("admin login rejects a CUSTOMER account with the generic error", async (page) => {
  await page.goto(`${admin.base}/login`);
  await login(page, "customer@kreative.test", "Sign in");
  await page.getByText("Invalid email or password.").waitFor();
  assert.equal(path(page), "/login");
});

await scenario("admin login -> dashboard; sign out -> login; dashboard closed again", async (page) => {
  await page.goto(`${admin.base}/login`);
  await login(page, "admin@kreative.test", "Sign in");
  await settle(page, "/dashboard");
  await page.getByTestId("admin-user").getByText("Demo Admin", { exact: false }).waitFor();
  await page.getByRole("link", { name: /^Orders\s*\d*$/ }).click();
  await settle(page, "/dashboard/orders");
  await page.getByRole("button", { name: "Sign out" }).click();
  await settle(page, "/login");
  await page.goBack().catch(() => {});
  await page.waitForTimeout(500);
  assert.equal(await page.getByTestId("admin-user").count(), 0, "admin shell must not be visible after sign out");
  await page.goto(`${admin.base}/dashboard`);
  await settle(page, "/login");
});

await scenario("customer: /orders requires login and returns to /orders after login", async (page) => {
  await page.goto(`${customer.base}/orders`);
  await settle(page, "/login");
  assert.equal(new URL(page.url()).searchParams.get("next"), "/orders");
  await login(page, "customer@kreative.test");
  await settle(page, "/orders");
});

await scenario("customer login rejects an ADMIN account", async (page) => {
  await page.goto(`${customer.base}/login`);
  await login(page, "admin@kreative.test");
  await page.getByText("Invalid email or password.").waitFor();
  assert.equal(path(page), "/login");
});

await scenario("customer login ignores open-redirect `next` targets", async (page) => {
  await page.goto(`${customer.base}/login?next=//evil.example.com`);
  await login(page, "customer@kreative.test");
  await settle(page, "/");
  assert.equal(new URL(page.url()).origin, customer.base);
});

await scenario("customer signup creates a customer (never admin)", async (page) => {
  await page.goto(`${customer.base}/signup`);
  await page.getByLabel("Full name").fill("Test Buyer");
  await page.getByLabel("Email").fill("buyer@example.test");
  await page.getByLabel("Password (10+ characters)").fill("a-long-password-1");
  await page.getByLabel("Confirm password").fill("a-long-password-1");
  await page.getByRole("checkbox").click();
  await page.getByRole("button", { name: "Create account" }).click();
  await settle(page, "/");
  await page.getByTestId("signed-in-as").getByText("(customer)", { exact: false }).waitFor();
});

await scenario("signed-in CUSTOMER cannot enter the admin dashboard, even with tampered storage/cookies", async (page, context) => {
  await page.goto(`${customer.base}/login`);
  await login(page, "customer@kreative.test");
  await settle(page, "/");
  await page.evaluate(() => {
    localStorage.setItem("role", "admin");
    localStorage.setItem("session", JSON.stringify({ user: { role: "super_admin" } }));
    sessionStorage.setItem("role", "admin");
  });
  // Same browser, admin portal: forged state in the customer origin is irrelevant there...
  await page.goto(`${admin.base}/dashboard`);
  await settle(page, "/login");
  // ...and forging state/cookies on the admin origin itself doesn't help either.
  await page.evaluate(() => {
    localStorage.setItem("role", "admin");
    localStorage.setItem("session", JSON.stringify({ user: { role: "super_admin" }, expiresAt: "2999-01-01" }));
  });
  await context.addCookies([{ name: "role", value: "admin", url: admin.base }]);
  await page.goto(`${admin.base}/dashboard/settings`);
  await settle(page, "/login");
  assert.equal(await page.getByTestId("admin-user").count(), 0);
});

await browser.close();
customer.server.close();
admin.server.close();
console.log(failed ? `\n${failed} scenario(s) failed` : "\nAll auth scenarios passed");
process.exit(failed ? 1 : 0);
