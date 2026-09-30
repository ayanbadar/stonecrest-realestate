import { Link, useParams } from "react-router-dom";

import { TextLink } from "@/components/brand/text-link";
import { Reveal } from "@/components/motion/reveal";
import { QueryState } from "@/components/query-state";
import { ROUTES } from "@/constants/routes";
import { useListing } from "@/features/listings/api/listings.api";
import {
  formatArea,
  formatPrice,
  statusLabel,
  typeLabel,
} from "@/features/listings/utils/format";

export function ListingDetailPage() {
  const { slug = "" } = useParams();
  const query = useListing(slug);
  const property = query.data;

  return (
    <div className="pt-[4.5rem] lg:pt-20">
      <QueryState
        isLoading={query.isLoading}
        isError={query.isError}
        isEmpty={!query.isLoading && !property}
        errorMessage="Unable to load this residence."
        emptyMessage="Residence not found."
        onRetry={() => void query.refetch()}
      >
        {property ? (
          <>
            <section className="relative min-h-[70vh] overflow-hidden bg-muted">
              {property.cover_url ? (
                <img
                  src={property.cover_url}
                  alt={property.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />
              <div className="container-editorial relative flex min-h-[70vh] flex-col justify-end pb-14 pt-32">
                <Reveal>
                  <p className="label-caps text-white/70">
                    {statusLabel(property.status)} · {typeLabel(property.property_type)}
                  </p>
                  <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
                    {property.title}
                  </h1>
                  <p className="mt-4 text-base text-white/75 md:text-lg">
                    {property.community}, {property.city}
                  </p>
                </Reveal>
              </div>
            </section>

            <section className="container-editorial section-y">
              <div className="grid gap-16 lg:grid-cols-[1.4fr_0.8fr] lg:gap-24">
                <div>
                  <Reveal>
                    <p className="label-caps text-muted-foreground">Overview</p>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/90 md:text-xl">
                      {property.short_description}
                    </p>
                    <div className="mt-10 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                      {property.description}
                    </div>
                  </Reveal>

                  {property.images.length > 0 ? (
                    <div className="mt-16">
                      <p className="label-caps text-muted-foreground">Gallery</p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {property.images.map((image) => (
                          <div
                            key={image.id}
                            className="overflow-hidden bg-muted"
                          >
                            <img
                              src={image.url}
                              alt={image.alt || property.title}
                              className="aspect-[4/3] w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <aside className="lg:sticky lg:top-28 lg:self-start">
                  <Reveal>
                    <div className="border border-border p-8">
                      <p className="font-display text-3xl tracking-tight md:text-4xl">
                        {formatPrice(property.price, property.currency)}
                      </p>
                      <dl className="mt-8 space-y-4 border-t border-border pt-8">
                        <div className="flex justify-between gap-4 text-sm">
                          <dt className="text-muted-foreground">Bedrooms</dt>
                          <dd>{property.bedrooms}</dd>
                        </div>
                        <div className="flex justify-between gap-4 text-sm">
                          <dt className="text-muted-foreground">Bathrooms</dt>
                          <dd>{property.bathrooms}</dd>
                        </div>
                        <div className="flex justify-between gap-4 text-sm">
                          <dt className="text-muted-foreground">Area</dt>
                          <dd>{formatArea(property.area_sqft)}</dd>
                        </div>
                        <div className="flex justify-between gap-4 text-sm">
                          <dt className="text-muted-foreground">Type</dt>
                          <dd>{typeLabel(property.property_type)}</dd>
                        </div>
                      </dl>
                      <TextLink
                        to={`${ROUTES.contact.root()}?property=${property.slug}`}
                        className="mt-10"
                      >
                        Enquire about this residence
                      </TextLink>
                      <Link
                        to={ROUTES.listings.root()}
                        className="mt-6 block label-caps text-muted-foreground transition-opacity hover:opacity-70"
                      >
                        Back to catalog
                      </Link>
                    </div>
                  </Reveal>
                </aside>
              </div>
            </section>
          </>
        ) : null}
      </QueryState>
    </div>
  );
}
