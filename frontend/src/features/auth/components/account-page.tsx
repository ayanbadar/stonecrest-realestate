import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { TextButton } from "@/components/brand/text-link";
import { Reveal } from "@/components/motion/reveal";
import { ApiError } from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import {
  useChangePassword,
  useLogout,
  useMe,
  useUpdateMe,
} from "@/features/auth/api/auth.api";
import { authFieldClass } from "@/features/auth/components/auth-split-layout";

const profileSchema = z.object({
  first_name: z.string().min(1, "Enter your first name"),
  last_name: z.string().min(1, "Enter your last name"),
  email: z.string().email("Enter a valid email"),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password"),
    new_password: z.string().min(8, "Use at least 8 characters"),
    new_password_confirm: z.string().min(8, "Confirm your new password"),
  })
  .refine((values) => values.new_password === values.new_password_confirm, {
    message: "Passwords do not match",
    path: ["new_password_confirm"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function AccountPage() {
  const me = useMe();
  const updateMe = useUpdateMe();
  const changePassword = useChangePassword();
  const logout = useLogout();
  const navigate = useNavigate();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirm: "",
    },
  });

  const { reset: resetProfile } = profileForm;

  useEffect(() => {
    if (!me.data) return;
    resetProfile({
      first_name: me.data.first_name,
      last_name: me.data.last_name,
      email: me.data.email,
    });
  }, [me.data, resetProfile]);

  const onProfileSubmit = profileForm.handleSubmit(async (values) => {
    await updateMe.mutateAsync(values);
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
    await changePassword.mutateAsync(values);
    passwordForm.reset();
  });

  const onSignOut = async () => {
    try {
      await logout.mutateAsync();
    } finally {
      navigate(ROUTES.auth.login(), { replace: true });
    }
  };

  const user = me.data;

  return (
    <div>
      <section className="container-editorial section-y">
        <Reveal className="flex flex-col justify-between gap-8 border-b border-border pb-12 md:flex-row md:items-end">
          <div>
            <p className="label-caps text-muted-foreground">Account</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Your details.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              {user
                ? `Signed in as ${user.username}. Update your profile or change your password.`
                : "Manage your profile and password."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <TextButton
              type="button"
              tone="outline-dark"
              disabled={logout.isPending}
              onClick={() => void onSignOut()}
            >
              {logout.isPending ? "Signing out…" : "Sign out"}
            </TextButton>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-20 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="label-caps text-muted-foreground">Profile</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">
              Contact details
            </h2>
            <form onSubmit={onProfileSubmit} className="mt-10 space-y-8" noValidate>
              <label className="block">
                <span className="label-caps text-muted-foreground">First name</span>
                <input
                  className={authFieldClass}
                  autoComplete="given-name"
                  {...profileForm.register("first_name")}
                />
                {profileForm.formState.errors.first_name ? (
                  <p className="mt-2 text-xs text-destructive">
                    {profileForm.formState.errors.first_name.message}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="label-caps text-muted-foreground">Last name</span>
                <input
                  className={authFieldClass}
                  autoComplete="family-name"
                  {...profileForm.register("last_name")}
                />
                {profileForm.formState.errors.last_name ? (
                  <p className="mt-2 text-xs text-destructive">
                    {profileForm.formState.errors.last_name.message}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="label-caps text-muted-foreground">Email</span>
                <input
                  type="email"
                  className={authFieldClass}
                  autoComplete="email"
                  {...profileForm.register("email")}
                />
                {profileForm.formState.errors.email ? (
                  <p className="mt-2 text-xs text-destructive">
                    {profileForm.formState.errors.email.message}
                  </p>
                ) : null}
              </label>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <TextButton
                  type="submit"
                  tone="dark"
                  disabled={updateMe.isPending}
                >
                  {updateMe.isPending ? "Saving…" : "Save profile"}
                </TextButton>
                {updateMe.isSuccess ? (
                  <p className="text-sm text-muted-foreground" role="status">
                    Profile updated.
                  </p>
                ) : null}
                {updateMe.isError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {updateMe.error instanceof ApiError
                      ? updateMe.error.message
                      : "Unable to update profile."}
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>

          <Reveal>
            <p className="label-caps text-muted-foreground">Security</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">
              Change password
            </h2>
            <form
              onSubmit={onPasswordSubmit}
              className="mt-10 space-y-8"
              noValidate
            >
              <label className="block">
                <span className="label-caps text-muted-foreground">
                  Current password
                </span>
                <input
                  type="password"
                  className={authFieldClass}
                  autoComplete="current-password"
                  {...passwordForm.register("current_password")}
                />
                {passwordForm.formState.errors.current_password ? (
                  <p className="mt-2 text-xs text-destructive">
                    {passwordForm.formState.errors.current_password.message}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="label-caps text-muted-foreground">New password</span>
                <input
                  type="password"
                  className={authFieldClass}
                  autoComplete="new-password"
                  {...passwordForm.register("new_password")}
                />
                {passwordForm.formState.errors.new_password ? (
                  <p className="mt-2 text-xs text-destructive">
                    {passwordForm.formState.errors.new_password.message}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="label-caps text-muted-foreground">
                  Confirm new password
                </span>
                <input
                  type="password"
                  className={authFieldClass}
                  autoComplete="new-password"
                  {...passwordForm.register("new_password_confirm")}
                />
                {passwordForm.formState.errors.new_password_confirm ? (
                  <p className="mt-2 text-xs text-destructive">
                    {passwordForm.formState.errors.new_password_confirm.message}
                  </p>
                ) : null}
              </label>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <TextButton
                  type="submit"
                  tone="dark"
                  disabled={changePassword.isPending}
                >
                  {changePassword.isPending ? "Updating…" : "Update password"}
                </TextButton>
                {changePassword.isSuccess ? (
                  <p className="text-sm text-muted-foreground" role="status">
                    Password updated.
                  </p>
                ) : null}
                {changePassword.isError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {changePassword.error instanceof ApiError
                      ? changePassword.error.message
                      : "Unable to change password."}
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
