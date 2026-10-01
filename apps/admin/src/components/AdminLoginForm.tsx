import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthService } from "@cakeshop/auth/react";
import { Button, TextField, colors, spacing } from "@cakeshop/ui";
import { loginSchema, type LoginInput } from "@cakeshop/validation";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

export function AdminLoginForm() {
  const service = useAuthService();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await service.signIn("admin", values);
    if (result.status === "ok") router.replace("/dashboard");
    else if (result.status === "mfa_required") setFormError("Multi-factor verification is required but not yet available.");
    else setFormError(result.message);
  });

  return (
    <View style={{ gap: spacing.md }}>
      <Controller control={control} name="email" render={({ field, fieldState }) => (
        <TextField label="Work email" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
      )} />
      <Controller control={control} name="password" render={({ field, fieldState }) => (
        <TextField label="Password" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} secureTextEntry autoComplete="current-password" />
      )} />
      {formError ? <Text accessibilityRole="alert" style={{ color: colors.danger }}>{formError}</Text> : null}
      <Button label="Sign in" onPress={submit} loading={formState.isSubmitting} />
    </View>
  );
}
