import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH_POLICY, decideAccess } from "@cakeshop/auth";
import { useAuthService, useSession } from "@cakeshop/auth/react";
import { loginSchema, type LoginInput } from "@cakeshop/validation";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

const MFA_MESSAGE = "Multi-factor verification is required but not yet available.";

function Field({ label, error, trailing, ...input }: { label: string; error?: string | undefined; trailing?: ReactNode } & Omit<ComponentProps<"input">, "className">) {
  const id = useId();
  return (
    <div className={`login-field${error ? " invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="login-input">
        <input id={id} {...input} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} />
        {trailing}
      </div>
      {error ? <span id={`${id}-err`} role="alert" className="login-error">{error}</span> : null}
    </div>
  );
}

const DUTIES = [
  "Review custom designs and send quotations",
  "Verify payments before an order moves on",
  "Plan production on the calendar",
  "Keep products, options and stock up to date",
];

// Administrator login. There is intentionally no signup route.
export function Login() {
  const [params] = useSearchParams();
  const session = useSession();
  const service = useAuthService();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (decideAccess("admin", session, { requireMfa: AUTH_POLICY.adminRequiresMfa }).allowed) return <Navigate replace to="/dashboard" />;

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await service.signIn("admin", values);
    if (result.status === "ok") navigate("/dashboard", { replace: true });
    else if (result.status === "mfa_required") setFormError(MFA_MESSAGE);
    else setFormError(result.message);
  });

  const notice = params.get("denied") ? "Access denied. This area is restricted to bakery staff." : params.get("mfa") ? MFA_MESSAGE : null;

  return (
    <div className="login">
      <header className="login-bar">
        <strong>Kreative Cakes</strong>
        <span>Management</span>
      </header>
      <div className="login-awning" aria-hidden="true" />
      <main className="login-main">
        <section className="login-card" aria-labelledby="login-title">
          <h1 id="login-title">Staff sign in</h1>
          <p className="login-sub">Authorised bakery staff only. Customers sign in on the main site.</p>
          {notice ? <p role="alert" className="login-alert">{notice}</p> : null}
          <form onSubmit={submit} noValidate>
            <Field label="Work email" type="email" autoComplete="email" error={formState.errors.email?.message} {...register("email")} />
            <Field
              label="Password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              error={formState.errors.password?.message}
              trailing={
                <button type="button" className="login-eye" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} onClick={() => setShow((v) => !v)}>
                  {show ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
              }
              {...register("password")}
            />
            {formError ? <p role="alert" className="login-alert">{formError}</p> : null}
            <button className="login-submit" type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? "Signing in…" : "Sign in"}</button>
          </form>
        </section>

        <aside className="login-case" aria-label="What staff do here">
          <h2>Run the shop from one place</h2>
          <ul>{DUTIES.map((d) => <li key={d}>{d}</li>)}</ul>
        </aside>
      </main>
    </div>
  );
}
