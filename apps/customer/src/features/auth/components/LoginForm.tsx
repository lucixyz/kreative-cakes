import { zodResolver } from "@hookform/resolvers/zod";
import { safeRedirectPath } from "@cakeshop/auth";
import { useAuthService } from "@cakeshop/auth/react";
import { Button, TextField, colors, spacing } from "@cakeshop/ui";
import { loginSchema, type LoginInput } from "@cakeshop/validation";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

export function LoginForm({ next }: { next?: string | string[] | undefined }) {
  const service = useAuthService();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await service.signIn("customer", values);
    if (result.status === "ok") router.replace((safeRedirectPath(next) ?? "/") as never);
    else setFormError(result.status === "error" ? result.message : "Additional verification is required.");
  });

  return (
    <View style={{ gap: spacing.md }}>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField label="Email" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField label="Password" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} secureTextEntry autoComplete="current-password" />
        )}
      />
      {formError ? (
        <Text accessibilityRole="alert" style={{ color: colors.danger }}>
          {formError}
        </Text>
      ) : null}
      <Button label="Log in" onPress={submit} loading={formState.isSubmitting} />
      <Text style={{ color: colors.textMuted }}>
        New here? <Link href="/signup">Create an account</Link>
      </Text>
    </View>
  );
}
