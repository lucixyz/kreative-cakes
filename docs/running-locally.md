# Running Kreative Cakes locally

Written for developers setting the project up on their own machine.

## What runs where

| App | What it is | Command | URL |
| --- | --- | --- | --- |
| `apps/web` | Customer website (Vite + React) | `pnpm dev:web` | http://localhost:5173 |
| `apps/admin` | Admin website (Vite + React) | `pnpm dev:admin` | http://localhost:8082/login |
| `apps/customer` | Customer mobile app (Expo Router) | `pnpm dev:customer` | QR code in the terminal |
| `apps/api` | Hono API | `pnpm dev:api` | http://localhost:8787/health |

The websites do not call the API yet, so `pnpm dev:web` and `pnpm dev:admin` work on their own.

## 1. Requirements

- **Node.js 20 or newer** (`node -v`)
- **pnpm 12** (`npm i -g pnpm`). Always use `pnpm` in this repo, not `npm`. The repo is a pnpm workspace with a `pnpm-lock.yaml`.
- For the mobile app only: the **Expo Go** app on your phone, or an Android emulator / iOS simulator.

## 2. First-time setup

```bash
git clone git@github.com:lucixyz/kreative-cakes.git
cd kreative-cakes
pnpm install
```

Optional: copy the environment file. The defaults use mock auth and mock AI, so no keys are needed.

```bash
# macOS / Linux / Git Bash
cp .env.example .env
# Windows PowerShell
copy .env.example .env
```

## 3. Run the apps

Open one terminal per app, all in the repo root.

```bash
pnpm dev:web        # customer website  -> http://localhost:5173
pnpm dev:admin      # admin website     -> http://localhost:8082/login
pnpm dev:api        # API (optional)    -> http://localhost:8787/health
pnpm dev:customer   # mobile app (Expo) -> scan the QR code with Expo Go
```

Vite reloads the page when you save a file.

## 4. Demo accounts

Login uses dev-only mock accounts, all with the password `Prototype#12345`. Sessions are kept in memory, so a page reload signs you out. More detail is in [auth.md](auth.md).

| Site | Email |
| --- | --- |
| Customer website | `customer@kreative.test` |
| Admin website | `admin@kreative.test` (also `staff@kreative.test`, `super@kreative.test`) |

Customer accounts are rejected on the admin site, and admin accounts are rejected on the customer site. You can also create a new customer on `/signup`.

## 5. Check your work

```bash
pnpm verify      # typecheck + lint + unit tests
pnpm e2e:auth    # browser test for customer/admin login separation
```

`pnpm e2e:auth` builds both websites and drives Microsoft Edge with Playwright. To use Chrome instead, set `BROWSER_CHANNEL=chrome` first.

## 6. Build for production

```bash
pnpm --filter @cakeshop/web build      # output: apps/web/dist
pnpm --filter @cakeshop/admin build    # output: apps/admin/dist
pnpm --filter @cakeshop/web preview    # serve the built site locally
```

Production builds refuse to start the mock login. To try a build with mock login, set `VITE_ALLOW_MOCK_AUTH=true`:

```bash
# Git Bash / macOS / Linux
VITE_ALLOW_MOCK_AUTH=true pnpm --filter @cakeshop/web build
# PowerShell
$env:VITE_ALLOW_MOCK_AUTH = "true"; pnpm --filter @cakeshop/web build
```

Deploying to Vercel is covered in the main [README](../README.md#deploying-the-websites-vercel).

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `pnpm: command not found` | `npm i -g pnpm`, then open a new terminal. |
| pnpm version error | `corepack enable`, then retry. The repo pins pnpm 12.8.1. |
| Port already in use | Close the other process, or stop the old dev server. Vite uses the next free port and prints it. |
| Blank page in a production build | The mock login is disabled in production. Set `VITE_ALLOW_MOCK_AUTH=true` for demo builds. |
| Odd install errors after switching branches | Delete `node_modules` and run `pnpm install` again. |
| Expo app can't connect | Put the phone and computer on the same Wi-Fi, or run `pnpm dev:customer` and press `s` to switch to Expo Go. |
| `.turbo` folder | Turborepo's local task cache. It is safe to delete and is git-ignored. |
