import { joinPath } from "@/utils";

/**
 * Centralized route definitions.
 * Always generate routes through these helpers — never hardcode path strings.
 */
export const ROUTES = {
  root: () => "/",

  listings: {
    root: () => joinPath(ROUTES.root(), "listings"),
    detail: (slug: string) => joinPath(ROUTES.listings.root(), slug),
  },

  residencies: {
    root: () => joinPath(ROUTES.root(), "residencies"),
    new: () => joinPath(ROUTES.residencies.root(), "new"),
    edit: (slug: string) => joinPath(ROUTES.residencies.root(), slug, "edit"),
  },

  inquiries: {
    root: () => joinPath(ROUTES.root(), "inquiries"),
  },

  about: {
    root: () => joinPath(ROUTES.root(), "about"),
  },

  services: {
    root: () => joinPath(ROUTES.root(), "services"),
  },

  contact: {
    root: () => joinPath(ROUTES.root(), "contact"),
  },

  auth: {
    login: () => joinPath(ROUTES.root(), "login"),
    forgotPassword: () => joinPath(ROUTES.root(), "forgot-password"),
    resetPassword: () => joinPath(ROUTES.root(), "reset-password"),
    account: () => joinPath(ROUTES.root(), "account"),
  },

  demo: {
    root: () => joinPath(ROUTES.root(), "demo"),
  },
} as const;

export const NAV_LINKS = [
  { label: "Residences", href: ROUTES.listings.root() },
  { label: "Services", href: ROUTES.services.root() },
  { label: "About", href: ROUTES.about.root() },
  { label: "Contact", href: ROUTES.contact.root() },
] as const;
