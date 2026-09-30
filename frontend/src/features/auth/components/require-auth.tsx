import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { QueryState } from "@/components/query-state";
import { ROUTES } from "@/constants/routes";
import { useMe } from "@/features/auth/api/auth.api";
import { hasAccessToken } from "@/lib/auth/tokens";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const authed = hasAccessToken();
  const me = useMe();

  if (!authed) {
    return (
      <Navigate
        to={ROUTES.auth.login()}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return (
    <QueryState
      isLoading={me.isLoading}
      isError={me.isError}
      isEmpty={false}
      onRetry={() => void me.refetch()}
      errorMessage="Unable to load your account. Your session may have expired."
    >
      {children}
    </QueryState>
  );
}

export function GuestOnly({ children }: { children: ReactNode }) {
  if (hasAccessToken()) {
    return <Navigate to={ROUTES.residencies.root()} replace />;
  }
  return children;
}
