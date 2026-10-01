import { zodResolver } from "@hookform/resolvers/zod";
import { decideAccess, safeRedirectPath } from "@cakeshop/auth";
import { useAuthService, useSession } from "@cakeshop/auth/react";
import { loginSchema, type LoginInput } from "@cakeshop/validation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AuthScreen } from "../components/AuthScreen";
import { Field } from "../components/Field";

// Customer login only. Staff/admin accounts sign in on the admin site and are rejected here.
export function Login() {
  const [params] = useSearchParams();
  const next = safeRedirectPath(params.get("next") ?? undefined) ?? "/";
  const session = useSession();
  const service = useAuthService();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (decideAccess("customer", session).allowed) return <Navigate replace to={next} />;

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await service.signIn("customer", values);
    if (result.status === "ok") navigate(next, { replace: true });
    else setFormError(result.status === "error" ? result.message : "Additional verification is required.");
  });

  return (
    <AuthScreen title="Log in">
      <form className="stack" onSubmit={submit} noValidate>
        <Field label="Email" type="email" autoComplete="email" error={formState.errors.email?.message} {...register("email")} />
        <Field label="Password" type="password" autoComplete="current-password" error={formState.errors.password?.message} {...register("password")} />
        {formError ? <p role="alert" className="error">{formError}</p> : null}
        <button className="btn" type="submit" disabled={formState.isSubmitting}>Log in</button>
        <p className="muted">New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </AuthScreen>
  );
}
