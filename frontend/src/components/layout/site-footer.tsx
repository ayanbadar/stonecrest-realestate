import { Link } from "react-router-dom";

import { Logo } from "@/components/brand/logo";
import { NAV_LINKS, ROUTES } from "@/constants/routes";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container-editorial section-y">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-6">
            <Logo variant="light" className="items-start text-left" />
            <p className="max-w-sm text-sm leading-relaxed text-white/65">
              Exceptional residences and curated developments across Dubai —
              presented with the precision of a private atelier.
            </p>
          </div>

          <div>
            <p className="label-caps text-white/45">Navigate</p>
            <ul className="mt-6 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/80 transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-caps text-white/45">Visit</p>
            <address className="mt-6 space-y-2 text-sm not-italic leading-relaxed text-white/80">
              <p>Dubai, United Arab Emirates</p>
              <a
                href="mailto:hello@stonecrestdxb.com"
                className="block transition-opacity hover:opacity-70"
              >
                hello@stonecrestdxb.com
              </a>
              <a
                href="tel:+971400000000"
                className="block transition-opacity hover:opacity-70"
              >
                +971 4 000 0000
              </a>
            </address>
            <Link
              to={ROUTES.contact.root()}
              className="mt-8 inline-block label-caps text-white/80 transition-opacity hover:opacity-70"
            >
              Arrange a consultation
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-white/15 pt-8 text-xs tracking-wide text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stonecrest Real Estate</p>
          <p className="uppercase tracking-[0.2em]">Stonecrestdxb.com</p>
        </div>
      </div>
    </footer>
  );
}
