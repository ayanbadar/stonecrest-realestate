import { Reveal } from "@/components/motion/reveal";
import { TextLink } from "@/components/brand/text-link";
import { ROUTES } from "@/constants/routes";
import { SERVICES } from "@/features/services/constants/content";
import { cn } from "@/lib/utils";

export function ServicesPage() {
  return (
    <div className="pt-[4.5rem] lg:pt-20">
      <section className="container-editorial section-y !pb-12">
        <Reveal>
          <p className="label-caps text-muted-foreground">Services</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Precision advisory for collectors of place.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Each engagement is intentional — fewer mandates, deeper preparation,
            and a presentation that matches the residence.
          </p>
        </Reveal>
      </section>

      <div className="space-y-0">
        {SERVICES.map((service, index) => {
          const reverse = index % 2 === 1;
          return (
            <section
              key={service.number}
              className={cn(
                "border-t border-border section-y",
                index % 2 === 0 ? "bg-background" : "bg-secondary/35",
              )}
            >
              <div
                className={cn(
                  "container-editorial grid items-center gap-12 lg:grid-cols-2 lg:gap-20",
                  reverse && "lg:[&>*:first-child]:order-2",
                )}
              >
                <Reveal variant="mask" className="overflow-hidden bg-muted">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="aspect-[5/4] w-full object-cover"
                    loading="lazy"
                  />
                </Reveal>
                <Reveal>
                  <p className="label-caps text-muted-foreground">
                    {service.number}
                  </p>
                  <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-lg text-foreground/90">
                    {service.summary}
                  </p>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                    {service.body}
                  </p>
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>

      <section className="border-t border-border bg-foreground text-background section-y">
        <div className="container-editorial text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-4xl tracking-tight md:text-5xl">
              Discuss a mandate in confidence.
            </h2>
            <div className="mt-10 flex justify-center">
              <TextLink to={ROUTES.contact.root()} tone="light">
                Contact Stonecrest
              </TextLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
