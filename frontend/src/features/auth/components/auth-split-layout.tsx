import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { ROUTES } from "@/constants/routes";

const AUTH_PANEL_IMAGE = "/images/auth-panel.jpg";

type AuthSplitLayoutProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthSplitLayout({
  children,
  eyebrow,
  title,
  description,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-foreground text-background lg:block">
        <img
          src={AUTH_PANEL_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Logo variant="light" showDescriptor className="items-start text-left" />
          <div className="max-w-md">
            <p className="label-caps text-white/60">Private access</p>
            <p className="mt-6 font-display text-4xl leading-[1.08] tracking-tight text-balance-pretty xl:text-5xl">
              Quiet rooms for considered decisions.
            </p>
          </div>
        </div>
      </aside>

      <section className="relative flex flex-col bg-background">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-5 sm:px-8 lg:px-12">
          <div className="lg:hidden">
            <Logo variant="dark" showDescriptor={false} className="items-start text-left" />
          </div>
          <Link
            to={ROUTES.root()}
            className="ml-auto label-caps text-muted-foreground transition-opacity hover:opacity-70"
          >
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center px-5 py-12 sm:px-8 lg:px-12 xl:px-20">
          <Reveal className="mx-auto w-full max-w-md">
            <p className="label-caps text-muted-foreground">{eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
            <div className="mt-10">{children}</div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export const authFieldClass =
  "mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground";
