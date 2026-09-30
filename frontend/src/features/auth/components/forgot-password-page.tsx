import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { TextButton } from "@/components/brand/text-link";
import { ROUTES } from "@/constants/routes";
import { useForgotPassword } from "@/features/auth/api/auth.api";
import {
  AuthSplitLayout,
  authFieldClass,
} from "@/features/auth/components/auth-split-layout";
import { GuestOnly } from "@/features/auth/components/require-auth";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  return (
    <GuestOnly>
      <ForgotPasswordContent />
    </GuestOnly>
  );
}

function ForgotPasswordContent() {
  const forgot = useForgotPassword();
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await forgot.mutateAsync(values);
  });

  return (
    <AuthSplitLayout
      eyebrow="Account"
      title="Reset access."
      description="Enter the email on your account. If it matches, we will send a reset link."
    >
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <label className="block">
          <span className="label-caps text-muted-foreground">Email</span>
          <input
            type="email"
            className={authFieldClass}
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <TextButton type="submit" tone="dark" disabled={forgot.isPending}>
            {forgot.isPending ? "Sending…" : "Send reset link"}
          </TextButton>
          <Link
            to={ROUTES.auth.login()}
            className="label-caps text-muted-foreground transition-opacity hover:opacity-70"
          >
            Back to sign in
          </Link>
        </div>

        {forgot.isSuccess ? (
          <p className="text-sm text-muted-foreground" role="status">
            If an account with that email exists, a password reset link has been
            sent.
          </p>
        ) : null}
        {forgot.isError ? (
          <p className="text-sm text-destructive" role="alert">
            Unable to send reset link. Please try again.
          </p>
        ) : null}
      </form>
    </AuthSplitLayout>
  );
}
