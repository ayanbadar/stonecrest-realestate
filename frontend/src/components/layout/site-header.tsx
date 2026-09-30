import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { TextLink } from "@/components/brand/text-link";
import { NAV_LINKS, ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const menuId = useId();

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (open) setOpen(false);
  }

  const isHome = pathname === ROUTES.root();
  const overHero = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          overHero
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border/70 bg-background/90 backdrop-blur-md",
        )}
      >
        <div className="container-editorial flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Logo
            variant={overHero ? "light" : "dark"}
            showDescriptor={false}
            className="items-start text-left"
          />

          <nav
            className="hidden items-center gap-10 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "label-caps transition-opacity duration-300 hover:opacity-70",
                    overHero ? "text-white" : "text-foreground",
                    active ? "opacity-100" : "opacity-70",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-8 lg:flex">
            <Link
              to={ROUTES.auth.account()}
              className={cn(
                "label-caps transition-opacity duration-300 hover:opacity-70",
                overHero ? "text-white/80" : "text-muted-foreground",
              )}
            >
              Account
            </Link>
            <TextLink
              to={ROUTES.listings.root()}
              tone={overHero ? "light" : "dark"}
            >
              Browse residences
            </TextLink>
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex size-10 items-center justify-center lg:hidden",
              overHero ? "text-white" : "text-foreground",
            )}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <div
        id={menuId}
        className={cn(
          "fixed inset-0 z-40 bg-foreground text-background transition-[opacity,visibility] duration-500 lg:hidden",
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="container-editorial flex h-full flex-col pb-12 pt-28">
          <nav className="flex flex-1 flex-col justify-center gap-8" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-display text-4xl tracking-tight text-background sm:text-5xl"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-6 self-start">
            <Link
              to={ROUTES.auth.account()}
              className="label-caps text-background/70 transition-opacity hover:opacity-100"
              onClick={() => setOpen(false)}
            >
              Account
            </Link>
            <TextLink to={ROUTES.listings.root()} tone="light">
              Browse residences
            </TextLink>
          </div>
        </div>
      </div>
    </>
  );
}
