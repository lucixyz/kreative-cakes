import { zodResolver } from "@hookform/resolvers/zod";
import { decideAccess, safeRedirectPath } from "@cakeshop/auth";
import { useAuthService, useSession } from "@cakeshop/auth/react";
import { loginSchema, type LoginInput } from "@cakeshop/validation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AuthScreen } from "../components/AuthScreen";
import { Dialog } from "../components/Dialog";
import { Field } from "../components/Field";

// PROTOTYPE: password reset and one-time codes are not connected to the auth service yet. The dialogs
// follow the design but never claim an email was sent, and never sign anyone in.
function ResetDialog({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <Dialog title={sent ? "Check your email" : "Reset your password"} onClose={onClose}>
      {sent ? (
        <>
          <p className="muted">If an account exists for that email, a reset link would be on its way. Password reset isn’t connected in this prototype yet, so nothing was sent.</p>
          <div className="row tight end"><button type="button" className="pill dark" onClick={onClose}>Back to log in</button></div>
        </>
      ) : (
        <form className="stack" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <p className="muted">Enter your email and we’ll send you a link to choose a new password.</p>
          <Field label="Email" type="email" autoComplete="email" required />
          <div className="row tight end">
            <button type="button" className="pill ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="pill dark">Send reset link</button>
          </div>
        </form>
      )}
    </Dialog>
  );
}

function OtpDialog({ onClose }: { onClose: () => void }) {
  const [error, setError] = useState(false);
  return (
    <Dialog title="Email me a one-time code" onClose={onClose}>
      <p className="muted">We’ll email a 6-digit code that expires in 10 minutes.</p>
      <form className="stack" onSubmit={(e) => { e.preventDefault(); setError(true); }}>
        <Field label="Email" type="email" autoComplete="email" required />
        <Field label="6-digit code" type="text" inputMode="numeric" maxLength={6} autoComplete="one-time-code" />
        {error ? <p role="alert" className="error">One-time codes aren’t available in this prototype yet. Please log in with your password.</p> : null}
        <div className="row tight end">
          <button type="button" className="pill ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="pill dark">Verify code</button>
        </div>
      </form>
    </Dialog>
  );
}

// Customer login only. Staff/admin accounts sign in on the admin site and are rejected here.
export function Login() {
  const [params] = useSearchParams();
  const next = safeRedirectPath(params.get("next") ?? undefined) ?? "/";
  const session = useSession();
  const service = useAuthService();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"reset" | "otp" | null>(null);
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
    <AuthScreen title="Log in" note={params.get("next") ? "Log in to continue where you left off." : undefined}>
      <form className="stack" onSubmit={submit} noValidate>
        <Field label="Email" type="email" autoComplete="email" error={formState.errors.email?.message} {...register("email")} />
        <Field label="Password" type="password" autoComplete="current-password" error={formState.errors.password?.message} {...register("password")} />
        <button type="button" className="link-btn muted align-start" onClick={() => setDialog("reset")}>Forgot password?</button>
        {formError ? <p role="alert" className="error">{formError}</p> : null}
        <button className="pill dark block" type="submit" disabled={formState.isSubmitting}>Log in</button>
        <p className="divider"><span>or</span></p>
        <button type="button" className="pill outline-dark block" onClick={() => setDialog("otp")}>Email me a one-time code</button>
        <p className="muted center">New here? <Link to="/signup" className="underline">Create an account</Link></p>
      </form>
      {dialog === "reset" ? <ResetDialog onClose={() => setDialog(null)} /> : null}
      {dialog === "otp" ? <OtpDialog onClose={() => setDialog(null)} /> : null}
    </AuthScreen>
  );
}
