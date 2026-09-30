import { TextButton } from "@/components/brand/text-link";
import { QueryState } from "@/components/query-state";
import { Reveal } from "@/components/motion/reveal";
import { ListingFilters } from "@/features/listings/components/listing-filters";
import { PropertyTile } from "@/features/listings/components/property-tile";
import { useListings } from "@/features/listings/api/listings.api";
import { useListingFilters } from "@/features/listings/hooks/use-listing-filters";

export function ListingsPage() {
  const { filters, params, setPage } = useListingFilters();
  const query = useListings(filters);
  const page = query.data;
  const properties = page?.results ?? [];
  const total = page?.count ?? 0;
  const pageSize = filters.page_size ?? 12;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = params.page || 1;

  return (
    <div className="pt-[4.5rem] lg:pt-20">
      <section className="container-editorial section-y !pb-12">
        <Reveal>
          <p className="label-caps text-muted-foreground">Residences</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-balance-pretty md:text-6xl lg:text-7xl">
            A curated catalog of exceptional homes.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Search by community, typology, and intention — every listing selected
            for architecture, setting, and enduring quality.
          </p>
        </Reveal>
      </section>

      <ListingFilters />

      <section className="container-editorial section-y !pt-12">
        <QueryState
          isLoading={query.isLoading}
          isError={query.isError}
          isEmpty={!query.isLoading && properties.length === 0}
          errorMessage="Unable to load residences. Please try again."
          emptyMessage="No residences match these filters."
          onRetry={() => void query.refetch()}
        >
          <div className="mb-8 flex items-end justify-between gap-4">
            <p className="label-caps text-muted-foreground">
              {total} residence{total === 1 ? "" : "s"}
            </p>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => (
              <PropertyTile
                key={property.id}
                property={property}
                priority={index < 3}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <TextButton
                type="button"
                tone="outline-dark"
                disabled={currentPage <= 1 || query.isFetching}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </TextButton>
              <TextButton
                type="button"
                tone="outline-dark"
                disabled={currentPage >= totalPages || query.isFetching}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </TextButton>
            </div>
          ) : null}
        </QueryState>
      </section>
    </div>
  );
}
