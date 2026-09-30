import type { ReactNode } from "react";

import { TextButton } from "@/components/brand/text-link";

type QueryStateProps = {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
};

/**
 * Shared loading / error / empty presentation conventions.
 */
export function QueryState({
  isLoading = false,
  isError = false,
  isEmpty = false,
  errorMessage = "Failed to load data.",
  emptyMessage = "Nothing to show yet.",
  onRetry,
  children,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="py-16" role="status">
        <p className="label-caps text-muted-foreground">Loading</p>
        <div className="mt-6 h-px w-16 animate-pulse bg-foreground/30" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-5 py-16">
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
        {onRetry ? (
          <TextButton type="button" tone="outline-dark" onClick={onRetry}>
            Retry
          </TextButton>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <p className="py-16 text-sm text-muted-foreground" role="status">
        {emptyMessage}
      </p>
    );
  }

  return children;
}
