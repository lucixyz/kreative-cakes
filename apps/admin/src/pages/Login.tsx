import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH_POLICY, decideAccess } from "@cakeshop/auth";
import { useAuthService, useSession } from "@cakeshop/auth/react";
import { loginSchema, type LoginInput } from "@cakeshop/validation";
import { useState, type ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

const MFA_MESSAGE = "Multi-factor verification is required but not yet available.";

function Field({ label, error, ...input }: { label: string; error?: string | undefined } & Omit<ComponentProps<"input">, "className">) {
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

// Administrator login. There is intentionally no signup route.
export function Login() {
  const [params] = useSearchParams();
  const session = useSession();
  const service = useAuthService();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
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

  return (
    <main className="page" style={{ background: "var(--admin-bar)", minHeight: "100vh", justifyContent: "center", alignItems: "center" }}>
      <div className="auth-card" style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: 24 }}>
        <div className="stack" style={{ gap: 4 }}>
          <strong style={{ color: "var(--primary)", letterSpacing: 1 }}>KREATIVE CAKES · MANAGEMENT</strong>
          <h1 style={{ fontSize: 26 }}>Staff sign in</h1>
          <p className="muted">Authorised bakery staff only. Customers sign in on the main site.</p>
        </div>
        {params.get("denied") ? <p role="alert" className="error">Access denied. This area is restricted to bakery staff.</p> : null}
        {params.get("mfa") ? <p role="alert" className="error">{MFA_MESSAGE}</p> : null}
        <form className="stack" onSubmit={submit} noValidate>
          <Field label="Work email" type="email" autoComplete="email" error={formState.errors.email?.message} {...register("email")} />
          <Field label="Password" type="password" autoComplete="current-password" error={formState.errors.password?.message} {...register("password")} />
          {formError ? <p role="alert" className="error">{formError}</p> : null}
          <button className="btn" type="submit" disabled={formState.isSubmitting}>Sign in</button>
        </form>
      </div>
    </main>
  );
}
