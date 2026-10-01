import { productListPrice, storefrontProducts, type DietaryTag, type ProductOccasion, type ProductType } from "@cakeshop/database";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";

const PAGE = 9;
const TYPES: [ProductType, string][] = [["whole", "Whole cakes"], ["bento", "Bento cakes"], ["cupcakes", "Cupcakes"], ["pastries", "Pastries"]];
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
    ...(availability !== "any" ? [{ label: availability === "today" ? "Available today" : "Pre-order", remove: () => setOne("availability", "any", "any") }] : []),
  ];

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
          <p className="muted">Ready-made cakes and pastries, baked fresh daily. Want something one of a kind? <Link to="/cake-builder" className="underline">Design a custom cake</Link>.</p>
        </div>
        <label className="search">
          <span className="small muted">Search cakes</span>
          <input type="search" placeholder="Chocolate, ube, wedding…" value={q} onChange={(e) => setOne("q", e.target.value)} />
        </label>
      </div>

      <div className="shop-layout">
        <button className="pill ghost small filters-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}>{filtersOpen ? "Hide filters" : "Filters"}</button>
        <aside className={`filters${filtersOpen ? " open" : ""}`} aria-label="Filters">
          {checkboxes("Category", "type", TYPES, types)}
          {checkboxes("Occasion", "occasion", OCCASIONS, occasions)}
          <fieldset className="filter-group">
            <legend>Availability</legend>
            {([["any", "Any"], ["today", "Available today"], ["preorder", "Pre-order"]] as [string, string][]).map(([v, label]) => (
              <label key={v} className="check"><input type="radio" name="availability" checked={availability === v} onChange={() => setOne("availability", v, "any")} /> {label}</label>
            ))}
          </fieldset>
          {checkboxes("Dietary", "dietary", DIETARY, dietary)}
        </aside>

        <section aria-label="Results">
          <div className="results-bar">
            <div className="row tight">
              <span className="muted">{results.length} {results.length === 1 ? "cake" : "cakes"}</span>
              {chips.map((c) => <button key={c.label} className="chip-btn" onClick={c.remove}>{c.label} ✕</button>)}
            </div>
            <label className="sort"><span className="muted">Sort by</span>
              <select value={sort} onChange={(e) => setOne("sort", e.target.value, "featured")}>{SORTS.map(([k, label]) => <option key={k} value={k}>{label}</option>)}</select>
            </label>
          </div>
          {results.length === 0 ? (
            <div className="empty"><p>No cakes match those filters.</p><button className="pill ghost" onClick={() => setParams({}, { replace: true })}>Clear filters</button></div>
          ) : (
            <div className="grid-3">{results.slice(0, shown).map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
          {results.length > shown ? <div className="center"><button className="pill ghost" onClick={() => setShown(shown + PAGE)}>Load more cakes</button></div> : null}
        </section>
      </div>
    </main>
  );
}
