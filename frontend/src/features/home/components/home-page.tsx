import { TextLink } from "@/components/brand/text-link";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { ROUTES } from "@/constants/routes";
import { useListings } from "@/features/listings/api/listings.api";
import { PropertyTile } from "@/features/listings/components/property-tile";
import { CEO_MESSAGE, TEAM } from "@/features/about/constants/content";
import { SERVICES } from "@/features/services/constants/content";
import { QueryState } from "@/components/query-state";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=80";

const INTERIORS_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80";

export function HomePage() {
  const featured = useListings({ featured: true, page_size: 4 });
  const residences = featured.data?.results ?? [];

  return (
    <>
      <section className="relative min-h-svh overflow-hidden bg-foreground text-background">
        <Parallax className="absolute inset-0" strength={0.08}>
          <img
            src={HERO_IMAGE}
            alt="Architectural residence interior with soft light"
            className="h-[115%] w-full object-cover opacity-80"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25" />
        <div className="container-editorial relative flex min-h-svh flex-col justify-end pb-16 pt-32 md:pb-24">
          <Reveal>
            <p className="label-caps text-white/65">Dubai · Private brokerage</p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] tracking-tight text-balance-pretty sm:text-6xl md:text-7xl lg:text-8xl">
              Residences composed with quiet certainty.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              A catalog of exceptional homes — curated for architecture, light,
              and lasting craft.
            </p>
            <div className="mt-10">
              <TextLink to={ROUTES.listings.root()} tone="light">
                Browse residences
              </TextLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="label-caps text-muted-foreground">Featured</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl tracking-tight md:text-5xl">
                Selected residences
              </h2>
            </div>
            <TextLink to={ROUTES.listings.root()}>View full catalog</TextLink>
          </Reveal>

          <div className="mt-14">
            <QueryState
              isLoading={featured.isLoading}
              isError={featured.isError}
              isEmpty={!featured.isLoading && residences.length === 0}
              onRetry={() => void featured.refetch()}
            >
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
                {residences.map((property, index) => (
                  <PropertyTile
                    key={property.id}
                    property={property}
                    priority={index < 2}
                    layout={index === 0 ? "tall" : "standard"}
                    className={
                      index === 0
                        ? "lg:col-span-5"
                        : index === 1
                          ? "lg:col-span-7"
                          : "lg:col-span-6"
                    }
                  />
                ))}
              </div>
            </QueryState>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 section-y">
        <div className="container-editorial">
          <Reveal>
            <p className="label-caps text-muted-foreground">Services</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl tracking-tight md:text-5xl">
              Counsel measured in craft, not volume.
            </h2>
          </Reveal>
          <ol className="mt-16 divide-y divide-border border-y border-border">
            {SERVICES.map((service, index) => (
              <Reveal key={service.number} as="li" delayMs={index * 60}>
                <div className="grid gap-4 py-8 md:grid-cols-[5rem_1fr_1.2fr] md:items-baseline md:gap-10">
                  <span className="label-caps text-muted-foreground">
                    {service.number}
                  </span>
                  <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {service.summary}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-10">
            <TextLink to={ROUTES.services.root()}>Explore services</TextLink>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="mask" className="overflow-hidden bg-muted">
            <img
              src={INTERIORS_IMAGE}
              alt="Refined interior detailing"
              className="aspect-[4/5] w-full object-cover md:aspect-[5/6]"
              loading="lazy"
            />
          </Reveal>
          <Reveal>
            <p className="label-caps text-muted-foreground">
              Interiors & developments
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
              Where architecture meets atelier craft.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Stonecrest collaborates with interior studios — including Meraki
              Interiors — to present homes where material, proportion, and light
              are inseparable from value.
            </p>
            <div className="mt-8 rule-left" />
            <div className="mt-8">
              <TextLink to={ROUTES.services.root()}>
                Discover the approach
              </TextLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-foreground text-background section-y">
        <div className="container-editorial grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <Reveal>
            <p className="label-caps text-white/45">CEO’s message</p>
            <blockquote className="mt-6 font-display text-3xl leading-snug tracking-tight text-balance-pretty md:text-4xl lg:text-5xl">
              “{CEO_MESSAGE.quote}”
            </blockquote>
            <p className="mt-8 label-caps text-white/55">
              {CEO_MESSAGE.name} · {CEO_MESSAGE.title}
            </p>
            <div className="mt-10">
              <TextLink to={ROUTES.about.root()} tone="light">
                Read the full letter
              </TextLink>
            </div>
          </Reveal>
          <Reveal variant="mask" className="overflow-hidden">
            <img
              src={CEO_MESSAGE.image}
              alt={CEO_MESSAGE.name}
              className="aspect-[4/5] w-full object-cover opacity-90"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="label-caps text-muted-foreground">People</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
                Meet the team
              </h2>
            </div>
            <TextLink to={ROUTES.about.root()}>About Stonecrest</TextLink>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, index) => (
              <Reveal key={member.name} delayMs={index * 70}>
                <div className="overflow-hidden bg-muted">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 font-display text-xl tracking-tight">
                  {member.name}
                </h3>
                <p className="mt-1 label-caps text-muted-foreground">
                  {member.role}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-foreground text-background">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-editorial relative section-y text-center">
          <Reveal>
            <p className="label-caps text-white/55">Private consultation</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
              Begin a conversation about your next residence.
            </h2>
            <div className="mt-10 flex justify-center">
              <TextLink to={ROUTES.contact.root()} tone="light">
                Arrange a consultation
              </TextLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
