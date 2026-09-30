import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { TextButton } from "@/components/brand/text-link";
import { ApiError } from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "@/features/auth/api/auth.api";
import {
  AuthSplitLayout,
  authFieldClass,
} from "@/features/auth/components/auth-split-layout";
import { GuestOnly } from "@/features/auth/components/require-auth";

const loginSchema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  return (
    <GuestOnly>
      <LoginContent />
    </GuestOnly>
  );
}

function LoginContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const from =
    (location.state as { from?: string } | null)?.from ?? ROUTES.residencies.root();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      navigate(from, { replace: true });
    } catch {
      // Error surfaced via mutation state below.
    }
  });

  const errorMessage =
    login.error instanceof ApiError
      ? login.error.message
      : login.isError
        ? "Unable to sign in. Please try again."
        : null;

  return (
    <AuthSplitLayout
      eyebrow="Account"
      title="Sign in."
      description="Access your Stonecrest account to manage details and preferences."
    >
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <label className="block">
          <span className="label-caps text-muted-foreground">Username</span>
          <input
            className={authFieldClass}
            autoComplete="username"
            {...form.register("username")}
          />
          {form.formState.errors.username ? (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.username.message}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Password</span>
          <input
            type="password"
            className={authFieldClass}
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <TextButton type="submit" tone="dark" disabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign in"}
          </TextButton>
          <Link
            to={ROUTES.auth.forgotPassword()}
            className="label-caps text-muted-foreground transition-opacity hover:opacity-70"
          >
            Forgot password
          </Link>
        </div>

        {errorMessage ? (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </form>
    </AuthSplitLayout>
  );
}
