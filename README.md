# Kreative Cakes

AI-powered cake and bakery e-commerce platform for [Kreative Cakes](https://www.facebook.com/kreativecakes.ph): customer website, admin website, customer mobile app (iOS/Android), and API. **Status: prototype, Phase 1 (foundation).**

## Stack

pnpm workspaces + Turborepo · TypeScript (strict) · Vite + React + React Router (customer website and admin website) · Expo SDK 57 + Expo Router (customer mobile app) · Hono API · Zod 4 · Vitest · Supabase (planned; mocks for now).

## Requirements

Node >= 20, pnpm 12 (`npm i -g pnpm`).

## Install & verify

```bash
pnpm install
pnpm verify        # typecheck + lint + test
```

## Run

| What | Command |
| --- | --- |
| Customer website (Vite, http://localhost:5173) | `pnpm dev:web` |
| Admin website (Vite, http://localhost:8082/login) | `pnpm dev:admin` |
| Customer mobile app (Expo) | `pnpm dev:customer` |
| API (http://localhost:8787/health) | `pnpm dev:api` |

Copy `.env.example` to `.env` for local config. Only `EXPO_PUBLIC_*` values may reach client bundles; secrets stay server-side.

## Workspace

```
apps/customer   Expo app (mobile + web)
apps/admin      Expo Router app, web-first
apps/api        Hono API (business logic that must not run on the client)
packages/config      tsconfig, eslint, env schemas, locale constants
packages/utils       money (integer centavos), dates, seeded RNG
packages/validation  Zod schemas: CakeDesign, AIDesignSuggestion, catalog, limits
packages/types       types inferred from schemas + status label maps
packages/auth        roles/portal policy, AuthService interface, route access decisions, dev-only mock
packages/ui          seed of the design system (inputs, button, placeholders)
packages/domain      pure rules: constraints, servings, pricing, payments, order state machine
packages/database    PROTOTYPE seed/mock data (migrations come later)
```

Dependency direction: `config → utils`, `validation → types → domain`, `database → validation/types`. Apps depend on packages, never the reverse.

## Deploying the websites (Vercel)

Two Vercel projects from this repo, Root Directory `apps/web` and `apps/admin`; each has a `vercel.json`. The mock auth service is disabled in production builds; for a demo deployment set `VITE_ALLOW_MOCK_AUTH=true`.

## Monorepo / Metro notes (mobile app)

- `.npmrc` sets `node-linker=hoisted`; Metro needs a flat `node_modules`.
- Expo SDK 52+ configures Metro for workspaces automatically, so each app's `metro.config.js` is just `getDefaultConfig(__dirname)`.
- Internal packages ship TypeScript source (`"main": "./src/index.ts"`) with no build step. Metro, Vitest and `tsx` all transpile them directly.
- pnpm 12 blocks dependency build scripts by default; `pnpm-workspace.yaml` allows `esbuild`.
- TypeScript is pinned to `~6.0.3` (Expo SDK 57's template version; typescript-eslint supports `<6.1`). TS 6 defaults `types` to `[]`, so Node packages opt in via `tsconfig.node.json`.

Auth: [docs/auth.md](docs/auth.md). Browser E2E for auth separation: `pnpm e2e:auth`.

More: [docs/architecture.md](docs/architecture.md), [docs/cake-design-schema.md](docs/cake-design-schema.md).
