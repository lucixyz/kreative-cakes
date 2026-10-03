import { productListPrice, storefrontProducts, type DietaryTag, type ProductOccasion, type ProductType } from "@cakeshop/database";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CloseIcon } from "../components/Icons";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/States";

const PAGE = 9;
const TYPE_LABELS: [ProductType, string][] = [["whole", "Whole cakes"], ["bento", "Bento cakes"], ["cupcakes", "Cupcakes"], ["pastries", "Pastries"]];
// Only offer filters the catalog can actually satisfy.
const TYPES = TYPE_LABELS.filter(([t]) => storefrontProducts.some((p) => p.type === t));
const FLAVOR_OPTIONS: [string, string][] = [...new Set(storefrontProducts.flatMap((p) => p.flavors))].sort().map((f) => [f, f]);
const SIZE_OPTIONS: [string, string][] = [["6in", "6-inch"], ["8in", "8-inch"], ["10in", "10-inch"]];
const PRICE_BANDS: [string, string, (centavos: number) => boolean][] = [
  ["any", "Any price", () => true],
  ["under-1000", "Under ₱1,000", (c) => c < 100_000],
  ["1000-1500", "₱1,000 to ₱1,500", (c) => c >= 100_000 && c <= 150_000],
  ["over-1500", "Over ₱1,500", (c) => c > 150_000],
];
const OCCASIONS: [ProductOccasion, string][] = [["birthday", "Birthday"], ["wedding", "Wedding"], ["anniversary", "Anniversary"], ["corporate", "Corporate"]];
const DIETARY: [DietaryTag, string][] = [["eggless", "Eggless"], ["sugar-free", "Sugar-free"], ["nut-free", "Nut-free"]];
const SORTS = [["featured", "Featured"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["name", "Name"]] as const;

type Sort = (typeof SORTS)[number][0];

export function Shop() {
  const [params, setParams] = useSearchParams();
  const [shown, setShown] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const types = params.getAll("type");
  const occasions = params.getAll("occasion");
  const dietary = params.getAll("dietary");
  const flavors = params.getAll("flavor");
  const size = params.get("size") ?? "any";
  const price = PRICE_BANDS.find(([k]) => k === params.get("price")) ?? PRICE_BANDS[0]!;
  const availability = params.get("availability") ?? "any";
  const q = params.get("q") ?? "";
  const sort = (SORTS.find(([k]) => k === params.get("sort"))?.[0] ?? "featured") as Sort;

  const update = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    mutate(next);
    setParams(next, { replace: true });
    setShown(PAGE);
  };
  const toggle = (key: string, value: string) =>
    update((p) => {
      const all = p.getAll(key);
      p.delete(key);
      (all.includes(value) ? all.filter((v) => v !== value) : [...all, value]).forEach((v) => p.append(key, v));
    });
  const setOne = (key: string, value: string, empty = "") => update((p) => (value === empty ? p.delete(key) : p.set(key, value)));

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = storefrontProducts.filter((p) =>
      (types.length === 0 || types.includes(p.type)) &&
      (occasions.length === 0 || (p.occasion !== null && occasions.includes(p.occasion))) &&
      (availability === "any" || (availability === "today" ? p.availability.kind === "today" : p.availability.kind === "preorder")) &&
      dietary.every((d) => p.dietary.includes(d as DietaryTag)) &&
      (flavors.length === 0 || p.flavors.some((f) => flavors.includes(f))) &&
      (size === "any" || p.sizes.some((s) => s.id === size)) &&
      price[2](productListPrice(p)) &&
      (needle === "" || `${p.name} ${p.label} ${p.flavors.join(" ")}`.toLowerCase().includes(needle)),
    );
    if (sort === "price-asc") return [...list].sort((a, b) => productListPrice(a) - productListPrice(b));
    if (sort === "price-desc") return [...list].sort((a, b) => productListPrice(b) - productListPrice(a));
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [params]);

  const chips: { label: string; remove: () => void }[] = [
    ...types.map((t) => ({ label: TYPES.find(([k]) => k === t)?.[1] ?? t, remove: () => toggle("type", t) })),
    ...occasions.map((o) => ({ label: OCCASIONS.find(([k]) => k === o)?.[1] ?? o, remove: () => toggle("occasion", o) })),
    ...dietary.map((d) => ({ label: DIETARY.find(([k]) => k === d)?.[1] ?? d, remove: () => toggle("dietary", d) })),
    ...flavors.map((f) => ({ label: f, remove: () => toggle("flavor", f) })),
    ...(size !== "any" ? [{ label: SIZE_OPTIONS.find(([k]) => k === size)?.[1] ?? size, remove: () => setOne("size", "any", "any") }] : []),
    ...(price[0] !== "any" ? [{ label: price[1], remove: () => setOne("price", "any", "any") }] : []),
    ...(availability !== "any" ? [{ label: availability === "today" ? "Available today" : "Pre-order", remove: () => setOne("availability", "any", "any") }] : []),
  ];
  const reset = () => { setParams(q ? { q } : {}, { replace: true }); setShown(PAGE); };

  const checkboxes = (title: string, key: string, options: [string, string][], selected: string[]) => (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {options.map(([value, label]) => (
        <label key={value} className="check"><input type="checkbox" checked={selected.includes(value)} onChange={() => toggle(key, value)} /> {label}</label>
      ))}
    </fieldset>
  );

  return (
    <main className="page-wrap">
      <p className="crumbs"><Link to="/">Home</Link> / Shop</p>
      <div className="shop-head">
        <div>
          <h1>Shop cakes</h1>
          <p className="muted">Ready-made cakes to order for pickup or delivery. Want something one of a kind? <Link to="/cake-builder" className="underline">Design a custom cake</Link>.</p>
        </div>
        <label className="search">
          <span className="small muted">Search cakes</span>
          <input type="search" placeholder="Chocolate, ube, wedding…" value={q} onChange={(e) => setOne("q", e.target.value)} />
        </label>
      </div>

      <div className="shop-layout">
        <button className="pill ghost small filters-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}>{filtersOpen ? "Hide filters" : chips.length > 0 ? `Filters (${chips.length})` : "Filters"}</button>
        <aside className={`filters${filtersOpen ? " open" : ""}`} aria-label="Filters">
          {checkboxes("Category", "type", TYPES, types)}
          {checkboxes("Occasion", "occasion", OCCASIONS, occasions)}
          <fieldset className="filter-group">
            <legend>Availability</legend>
            {([["any", "Any"], ["today", "Available today"], ["preorder", "Pre-order"]] as [string, string][]).map(([v, label]) => (
              <label key={v} className="check"><input type="radio" name="availability" checked={availability === v} onChange={() => setOne("availability", v, "any")} /> {label}</label>
            ))}
          </fieldset>
          {checkboxes("Flavor", "flavor", FLAVOR_OPTIONS, flavors)}
          <fieldset className="filter-group">
            <legend>Size</legend>
            {[["any", "Any size"], ...SIZE_OPTIONS].map(([v, label]) => (
              <label key={v} className="check"><input type="radio" name="size" checked={size === v} onChange={() => setOne("size", v!, "any")} /> {label}</label>
            ))}
          </fieldset>
          <fieldset className="filter-group">
            <legend>Price</legend>
            {PRICE_BANDS.map(([v, label]) => (
              <label key={v} className="check"><input type="radio" name="price" checked={price[0] === v} onChange={() => setOne("price", v, "any")} /> {label}</label>
            ))}
          </fieldset>
          {checkboxes("Dietary", "dietary", DIETARY, dietary)}
          <div className="filters-actions">
            {chips.length > 0 ? <button type="button" className="pill ghost small" onClick={reset}>Reset filters</button> : null}
            <button type="button" className="pill dark small drawer-done" onClick={() => setFiltersOpen(false)}>Show {results.length} {results.length === 1 ? "cake" : "cakes"}</button>
          </div>
        </aside>

        <section aria-label="Results">
          <div className="results-bar">
            <div className="row tight">
              <span className="muted">{results.length} {results.length === 1 ? "cake" : "cakes"}</span>
              {chips.map((c) => <button key={c.label} className="chip-btn" onClick={c.remove} aria-label={`Remove filter: ${c.label}`}>{c.label} <CloseIcon /></button>)}
              {chips.length > 0 ? <button type="button" className="link-btn small" onClick={reset}>Clear all</button> : null}
            </div>
            <label className="sort"><span className="muted">Sort by</span>
              <select value={sort} onChange={(e) => setOne("sort", e.target.value, "featured")}>{SORTS.map(([k, label]) => <option key={k} value={k}>{label}</option>)}</select>
            </label>
          </div>
          {results.length === 0 ? (
            <EmptyState title={q ? `No cakes match “${q}”` : "No cakes match those filters"} text="Try another flavor, or describe it to the AI Designer and we can make it custom."><button className="pill ghost" onClick={() => setParams({}, { replace: true })}>Reset filters</button><Link to="/ai-designer" className="pill dark">Open AI Designer</Link></EmptyState>
          ) : (
            <div className="grid-3">{results.slice(0, shown).map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
          {results.length > shown ? <div className="center"><button className="pill ghost" onClick={() => setShown(shown + PAGE)}>Load more cakes</button></div> : null}
        </section>
      </div>
    </main>
  );
}
