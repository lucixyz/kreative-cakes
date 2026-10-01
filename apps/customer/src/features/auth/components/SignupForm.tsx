import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthService } from "@cakeshop/auth/react";
import { Button, TextField, colors, spacing } from "@cakeshop/ui";
import { customerSignupSchema, type CustomerSignupInput } from "@cakeshop/validation";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

export function SignupForm() {
  const service = useAuthService();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<CustomerSignupInput>({
    resolver: zodResolver(customerSignupSchema),
    // acceptTerms starts unchecked; the schema requires `true`.
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", acceptTerms: false as unknown as true },
  });

  const submit = handleSubmit(async ({ fullName, email, password }) => {
    setFormError(null);
    // Only these fields are sent. No role is ever part of a sign-up request.
    const result = await service.signUpCustomer({ fullName, email, password });
    if (result.status === "ok") router.replace("/");
    else setFormError(result.status === "error" ? result.message : "Additional verification is required.");
  });

  return (
    <View style={{ gap: spacing.md }}>
      <Controller control={control} name="fullName" render={({ field, fieldState }) => (
        <TextField label="Full name" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} autoComplete="name" />
      )} />
      <Controller control={control} name="email" render={({ field, fieldState }) => (
        <TextField label="Email" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
      )} />
      <Controller control={control} name="password" render={({ field, fieldState }) => (
        <TextField label="Password (10+ characters)" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} secureTextEntry autoComplete="new-password" />
      )} />
      <Controller control={control} name="confirmPassword" render={({ field, fieldState }) => (
        <TextField label="Confirm password" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} secureTextEntry autoComplete="new-password" />
      )} />
      <Controller control={control} name="acceptTerms" render={({ field, fieldState }) => (
        <View style={{ gap: spacing.xs }}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel="I accept the Terms and Privacy Policy"
            accessibilityState={{ checked: field.value === true }}
            onPress={() => field.onChange(!field.value)}
            style={{ minHeight: 48, justifyContent: "center" }}
          >
            <Text style={{ color: colors.text }}>{field.value ? "☑" : "☐"} I accept the Terms and Privacy Policy</Text>
          </Pressable>
          {fieldState.error ? <Text accessibilityRole="alert" style={{ color: colors.danger }}>{fieldState.error.message}</Text> : null}
        </View>
      )} />
      {formError ? <Text accessibilityRole="alert" style={{ color: colors.danger }}>{formError}</Text> : null}
      <Button label="Create account" onPress={submit} loading={formState.isSubmitting} />
      <Text style={{ color: colors.textMuted }}>
        Already have an account? <Link href="/login">Log in</Link>
      </Text>
    </View>
  );
}
