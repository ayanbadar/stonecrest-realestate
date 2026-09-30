import { Link } from "react-router-dom";

import { TextButton, TextLink } from "@/components/brand/text-link";
import { QueryState } from "@/components/query-state";
import { Reveal } from "@/components/motion/reveal";
import { ROUTES } from "@/constants/routes";
import {
  useDeleteResidence,
  useListings,
} from "@/features/listings/api/listings.api";
import {
  formatPrice,
  statusLabel,
} from "@/features/listings/utils/format";

export function MyResidenciesPage() {
  const query = useListings({ mine: true, page_size: 48 });
  const remove = useDeleteResidence();
  const items = query.data?.results ?? [];

  return (
    <div>
      <section className="container-editorial section-y">
        <Reveal className="flex flex-col justify-between gap-8 border-b border-border pb-12 md:flex-row md:items-end">
          <div>
            <p className="label-caps text-muted-foreground">Account</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Your residencies.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Create, review, update, or remove listing records linked to your
              account.
            </p>
          </div>
          <TextLink to={ROUTES.residencies.new()}>New residence</TextLink>
        </Reveal>

        <div className="mt-12">
          <QueryState
            isLoading={query.isLoading}
            isError={query.isError}
            isEmpty={!query.isLoading && items.length === 0}
            errorMessage="Unable to load your residencies."
            emptyMessage="You have not created any residencies yet."
            onRetry={() => void query.refetch()}
          >
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="label-caps text-muted-foreground">
                      {statusLabel(item.status)}
                      {!item.is_published ? " · Draft" : ""}
                      {item.is_featured ? " · Featured" : ""}
                    </p>
                    <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.community}, {item.city} ·{" "}
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      to={ROUTES.listings.detail(item.slug)}
                      className="label-caps text-muted-foreground transition-opacity hover:opacity-70"
                    >
                      View
                    </Link>
                    <Link
                      to={ROUTES.residencies.edit(item.slug)}
                      className="label-caps text-muted-foreground transition-opacity hover:opacity-70"
                    >
                      Edit
                    </Link>
                    <TextButton
                      type="button"
                      tone="outline-dark"
                      disabled={remove.isPending}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete “${item.title}”? This cannot be undone.`,
                          )
                        ) {
                          void remove.mutateAsync(item.slug);
                        }
                      }}
                    >
                      Delete
                    </TextButton>
                  </div>
                </li>
              ))}
            </ul>
          </QueryState>
        </div>
      </section>
    </div>
  );
}
