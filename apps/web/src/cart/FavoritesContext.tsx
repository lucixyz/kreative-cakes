import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "kreative.favorites.v1";

type FavoritesApi = { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void };
const FavoritesContext = createContext<FavoritesApi | null>(null);

function load(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(load);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch { /* storage unavailable: favorites last for this visit */ }
  }, [ids]);
  const toggle = useCallback((id: string) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])), []);
  const value = useMemo(() => ({ ids, has: (id: string) => ids.includes(id), toggle }), [ids, toggle]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesApi {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>.");
  return ctx;
}
