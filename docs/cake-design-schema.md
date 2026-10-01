# CakeDesign schema

Source: `packages/validation/src/cake-design.ts`. Types are inferred in `@cakeshop/types`.

## Color roles

Palette `{ primary, secondary, accent }` + `accentFinish: matte | metallic`. Tiers, decorations and borders reference a role; `colorOverride` (hex) opts out. Changing `palette.primary` recolors everything using that role. Color names → hex: `COLOR_NAME_TO_HEX` in `@cakeshop/domain`.

## Placement

`{ tierIndex: number | "all" (0 = bottom), zone: top | side | border | base, distribution: even | cluster | cascade | random-seeded }`. The renderer places deterministically from a seed.

## Constraints (defaults in `DEFAULT_CAKE_LIMITS`)

| Rule | Default |
| --- | --- |
| Tiers | 1–4 (heart: max 2) |
| Diameter / height | 4–16 in / 3–8 in |
| Tier step | each tier ≥ 2 in narrower than the one below |
| Message / topper text | 40 / 30 characters |
| Decoration density | units per inch of tier diameter: top 2, side 3, border 4, base 2 |
| Supports | 3+ tiers: warning, complexity at least `medium` |

## Servings

`servings = Σ floor(tierVolume / 8)`, where `tierVolume = areaFactor × diameter² × height` and `areaFactor` is π/4 (round), 1 (square), 0.72 (heart). 8 in³ is one 1×2×4 in wedding portion (`cubicInchesPerServing`, configurable). Demo cake (10/8/6 in × 4 in, round) → 39 + 25 + 14 = 78.

## Complexity

Points: tiers (1→0, 2→1, 3→3, 4→5) + decoration units (≥8: +1, ≥20: +2) + heart (+1). `low` < 2, `medium` 2–4, `high` ≥ 5; 3+ tiers never `low`. AI-suggested complexity can only raise it.

## Derived fields

`servingEstimate` and `complexity` are recomputed by `finalizeDesign`; client-sent values are ignored.
