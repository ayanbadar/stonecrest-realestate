import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { PortalShell } from "@/components/layout/portal-shell";
import { SiteShell } from "@/components/layout/site-shell";
import { ROUTES } from "@/constants/routes";
import { AboutPage } from "@/features/about/components/about-page";
import { AccountPage } from "@/features/auth/components/account-page";
import { ForgotPasswordPage } from "@/features/auth/components/forgot-password-page";
import { LoginPage } from "@/features/auth/components/login-page";
import { RequireAuth } from "@/features/auth/components/require-auth";
import { ResetPasswordPage } from "@/features/auth/components/reset-password-page";
import { ContactPage } from "@/features/contact/components/contact-page";
import { DemoPage } from "@/features/demo/components/demo-page";
import { HomePage } from "@/features/home/components/home-page";
import { InquiriesPage } from "@/features/inquiries/components/inquiries-page";
import { ListingDetailPage } from "@/features/listings/components/listing-detail-page";
import { ListingsPage } from "@/features/listings/components/listings-page";
import { MyResidenciesPage } from "@/features/listings/components/my-residencies-page";
import { ResidenceCreatePage } from "@/features/listings/components/residence-create-page";
import { ResidenceEditPage } from "@/features/listings/components/residence-edit-page";
import { ServicesPage } from "@/features/services/components/services-page";

function AuthedPortal({ children }: { children: ReactNode }) {
  return (
    <PortalShell>
      <RequireAuth>{children}</RequireAuth>
    </PortalShell>
  );
}

export function App() {
  return (
    <Routes>
      <Route
        path={ROUTES.root()}
        element={
          <SiteShell>
            <HomePage />
          </SiteShell>
        }
      />
      <Route
        path={ROUTES.listings.root()}
        element={
          <SiteShell>
            <ListingsPage />
          </SiteShell>
        }
      />
      <Route
        path={ROUTES.listings.detail(":slug")}
        element={
          <SiteShell>
            <ListingDetailPage />
          </SiteShell>
        }
      />
      <Route
        path={ROUTES.about.root()}
        element={
          <SiteShell>
            <AboutPage />
          </SiteShell>
        }
      />
      <Route
        path={ROUTES.services.root()}
        element={
          <SiteShell>
            <ServicesPage />
          </SiteShell>
        }
      />
      <Route
        path={ROUTES.contact.root()}
        element={
          <SiteShell>
            <ContactPage />
          </SiteShell>
        }
      />

      <Route path={ROUTES.auth.login()} element={<LoginPage />} />
      <Route path={ROUTES.auth.forgotPassword()} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.auth.resetPassword()} element={<ResetPasswordPage />} />

      <Route
        path={ROUTES.auth.account()}
        element={
          <AuthedPortal>
            <AccountPage />
          </AuthedPortal>
        }
      />
      <Route
        path={ROUTES.residencies.root()}
        element={
          <AuthedPortal>
            <MyResidenciesPage />
          </AuthedPortal>
        }
      />
      <Route
        path={ROUTES.residencies.new()}
        element={
          <AuthedPortal>
            <ResidenceCreatePage />
          </AuthedPortal>
        }
      />
      <Route
        path={ROUTES.residencies.edit(":slug")}
        element={
          <AuthedPortal>
            <ResidenceEditPage />
          </AuthedPortal>
        }
      />
      <Route
        path={ROUTES.inquiries.root()}
        element={
          <AuthedPortal>
            <InquiriesPage />
          </AuthedPortal>
        }
      />

      <Route path={ROUTES.demo.root()} element={<DemoPage />} />
      <Route path="*" element={<Navigate to={ROUTES.root()} replace />} />
    </Routes>
  );
}
