# Architecture

## Principles

- One contract: `CakeDesign` (Zod) is shared by builder, AI, saved designs, quotations and the 3D renderer.
- Pure domain: pricing, constraints, servings, payment derivation and the order state machine live in `@cakeshop/domain`. They run on the client (display) and the server (authoritative).
- The server never trusts client prices, statuses or derived fields (`servingEstimate`, `complexity`).
- Money is integer centavos everywhere. Basis points (`bps`, 10000 = 100%) for rates.
- Replaceable edges: mock repositories/providers sit behind interfaces so they can be swapped for Supabase/real AI without UI changes (interfaces arrive with the features that need them).

## Packages

See the README table. Phase 1 builds `config`, `utils`, `validation`, `types`, `domain`, `database` (seeds only) and the three apps. `ui`, `3d`, `ai`, `api-client` are added in later phases.

## Decisions made in Phase 1 (not specified in the brief)

- Package source is consumed directly (no build step).
- Catalog items carry their own prices (`priceCentavos`, `priceMultiplierBps`), so the catalog doubles as the price catalog. Price *rules* (base per cubic inch, tier fee, complexity multipliers, rush) are a separate `PriceRules` object.
- Catalog-independent physical rules are in Zod refinements; catalog-aware rules (heart max 2 tiers, allowed zones, dietary compatibility, unavailable options) are in `validateDesignConstraints`. One `CakeLimits` object feeds both.
- `DESIGN rejected by staff` maps to `CANCELLED` with a reason (no extra status).
- A rejected payment proof is terminal; the customer uploads a new transaction.
- Order transitions are a declarative table (`from`, `to`, `orderTypes`, `allowedRoles`, `guards`, `sideEffects`); the API executes side effects.
- Seed/demo data lives in `@cakeshop/database` and includes one deliberately unavailable decoration to exercise the "no longer available" state.
