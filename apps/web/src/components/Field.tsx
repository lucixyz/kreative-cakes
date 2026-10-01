import type { ComponentProps } from "react";

type Props = { label: string; error?: string | undefined } & Omit<ComponentProps<"input">, "className">;

export function Field({ label, error, ...input }: Props) {
  return (
    <div className={`field${error ? " invalid" : ""}`}>
      <label>
        {label}
        <input {...input} aria-invalid={error ? true : undefined} />
      </label>
      {error ? <span role="alert" className="error">{error}</span> : null}
    </div>
  );
}
