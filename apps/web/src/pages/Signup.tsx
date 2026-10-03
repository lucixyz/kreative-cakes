import { zodResolver } from "@hookform/resolvers/zod";
import { decideAccess } from "@cakeshop/auth";
import { useAuthService, useSession } from "@cakeshop/auth/react";
import { customerSignupSchema, type CustomerSignupInput } from "@cakeshop/validation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthScreen } from "../components/AuthScreen";
import { Field } from "../components/Field";

export function Signup() {
  const session = useSession();
  const service = useAuthService();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<CustomerSignupInput>({
    resolver: zodResolver(customerSignupSchema),
    // acceptTerms starts unchecked; the schema requires `true`.
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", acceptTerms: false as unknown as true },
  });

  if (decideAccess("customer", session).allowed) return <Navigate replace to="/" />;

  const submit = handleSubmit(async ({ fullName, email, password }) => {
    setFormError(null);
    // Only these fields are sent. No role is ever part of a sign-up request.
    const result = await service.signUpCustomer({ fullName, email, password });
    if (result.status === "ok") navigate("/", { replace: true });
    else setFormError(result.status === "error" ? result.message : "Additional verification is required.");
  });

  const { errors } = formState;
  return (
    <AuthScreen title="Create your account" note="Save designs, track quotes and orders in one place.">
      <form className="stack" onSubmit={submit} noValidate>
        <Field label="Full name" type="text" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Field label="Password (10+ characters)" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
        <Field label="Confirm password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        <div className="field">
          <label className="check">
            <input type="checkbox" {...register("acceptTerms")} /> I accept the Terms and Privacy Policy
          </label>
          {errors.acceptTerms ? <span role="alert" className="error">{errors.acceptTerms.message}</span> : null}
        </div>
        {formError ? <p role="alert" className="error">{formError}</p> : null}
        <button className="pill dark block" type="submit" disabled={formState.isSubmitting}>Create account</button>
        <p className="muted center">Already have an account? <Link to="/login" className="underline">Log in</Link></p>
      </form>
    </AuthScreen>
  );
}
