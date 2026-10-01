import { MAX_LINE_QUANTITY } from "@cakeshop/domain";

export function Stepper({ value, onChange, min = 1, label }: { value: number; onChange: (v: number) => void; min?: number; label: string }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= MAX_LINE_QUANTITY} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
