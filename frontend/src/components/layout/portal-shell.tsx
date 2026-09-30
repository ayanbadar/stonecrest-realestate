import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import { Logo } from "@/components/brand/logo";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type PortalShellProps = {
  children: ReactNode;
};

const PORTAL_LINKS = [
  { label: "Residencies", href: ROUTES.residencies.root() },
  { label: "Enquiries", href: ROUTES.inquiries.root() },
  { label: "Account", href: ROUTES.auth.account() },
] as const;

/**
 * Minimal shell for authenticated portal pages — no marketing nav/footer.
 */
export function PortalShell({ children }: PortalShellProps) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ScrollToTop />
      <header className="border-b border-border/70">
        <div className="container-editorial flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Logo variant="dark" showDescriptor={false} className="items-start text-left" />
          <nav className="flex items-center gap-8" aria-label="Portal">
            {PORTAL_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "label-caps transition-opacity hover:opacity-70",
                    active ? "text-foreground opacity-100" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
