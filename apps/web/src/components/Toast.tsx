import { CheckIcon } from "./Icons";
import { useCallback, useEffect, useRef, useState } from "react";

/** Polite, auto-dismissing toast. Render `node` once in the page; call `show(message)`. */
export function useToast() {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 2600);
  }, []);
  const node = (
    <div role="status" aria-live="polite">
      {msg ? <div className="toast"><CheckIcon />{msg}</div> : null}
    </div>
  );
  return { show, node };
}
