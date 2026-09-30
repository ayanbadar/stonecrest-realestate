import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { TextButton } from "@/components/brand/text-link";
import { ApiError } from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import { useResetPassword } from "@/features/auth/api/auth.api";
import {
  AuthSplitLayout,
  authFieldClass,
} from "@/features/auth/components/auth-split-layout";
import { GuestOnly } from "@/features/auth/components/require-auth";

const resetSchema = z
  .object({
    new_password: z.string().min(8, "Use at least 8 characters"),
    new_password_confirm: z.string().min(8, "Confirm your new password"),
  })
  .refine((values) => values.new_password === values.new_password_confirm, {
    message: "Passwords do not match",
    path: ["new_password_confirm"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export function ResetPasswordPage() {
  return (
    <GuestOnly>
      <ResetPasswordContent />
    </GuestOnly>
  );
}

function ResetPasswordContent() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const uid = params.get("uid") ?? "";
  const token = params.get("token") ?? "";
  const reset = useResetPassword();

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { new_password: "", new_password_confirm: "" },
  });

  const linkMissing = !uid || !token;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await reset.mutateAsync({
        uid,
        token,
        ...values,
      });
      navigate(ROUTES.auth.login(), { replace: true });
    } catch {
      // Error surfaced below.
    }
  });

  const errorMessage =
    reset.error instanceof ApiError
      ? reset.error.message
      : reset.isError
        ? "Unable to reset password. The link may be invalid or expired."
        : null;

  return (
    <AuthSplitLayout
      eyebrow="Account"
      title="Choose a new password."
      description="Set a new password to regain access to your Stonecrest account."
    >
      {linkMissing ? (
        <div className="space-y-6">
          <p className="text-sm text-destructive" role="alert">
            This reset link is incomplete. Request a new one from the forgot
            password page.
          </p>
          <Link
            to={ROUTES.auth.forgotPassword()}
            className="label-caps text-muted-foreground transition-opacity hover:opacity-70"
          >
            Request a new link
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-8" noValidate>
          <label className="block">
            <span className="label-caps text-muted-foreground">New password</span>
            <input
              type="password"
              className={authFieldClass}
              autoComplete="new-password"
              {...form.register("new_password")}
            />
            {form.formState.errors.new_password ? (
              <p className="mt-2 text-xs text-destructive">
                {form.formState.errors.new_password.message}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="label-caps text-muted-foreground">Confirm password</span>
            <input
              type="password"
              className={authFieldClass}
              autoComplete="new-password"
              {...form.register("new_password_confirm")}
            />
            {form.formState.errors.new_password_confirm ? (
              <p className="mt-2 text-xs text-destructive">
                {form.formState.errors.new_password_confirm.message}
              </p>
            ) : null}
          </label>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <TextButton type="submit" tone="dark" disabled={reset.isPending}>
              {reset.isPending ? "Saving…" : "Update password"}
            </TextButton>
            <Link
              to={ROUTES.auth.login()}
              className="label-caps text-muted-foreground transition-opacity hover:opacity-70"
            >
              Back to sign in
            </Link>
          </div>

          {errorMessage ? (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>
      )}
    </AuthSplitLayout>
  );
}
