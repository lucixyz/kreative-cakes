import { useEffect, useId, useRef, type ReactNode } from "react";

/** Modal dialog: closes on Escape / backdrop click, moves focus in, and restores it on close. */
export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("input, button, select, textarea")?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [onClose]);
  return (
    <div className="scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className="dialog" role="dialog" aria-modal="true" aria-labelledby={id}>
        <h2 id={id}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
