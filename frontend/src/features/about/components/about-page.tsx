import { Reveal } from "@/components/motion/reveal";
import { TextLink } from "@/components/brand/text-link";
import { ROUTES } from "@/constants/routes";
import { CEO_MESSAGE, TEAM } from "@/features/about/constants/content";

export function AboutPage() {
  return (
    <div className="pt-[4.5rem] lg:pt-20">
      <section className="container-editorial section-y !pb-12">
        <Reveal>
          <p className="label-caps text-muted-foreground">About</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            A private practice for exceptional homes.
          </h1>
        </Reveal>
      </section>

      <section className="border-y border-border bg-foreground text-background section-y">
        <div className="container-editorial grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal variant="mask" className="overflow-hidden">
            <img
              src={CEO_MESSAGE.image}
              alt={CEO_MESSAGE.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </Reveal>
          <Reveal>
            <p className="label-caps text-white/45">CEO’s message</p>
            <blockquote className="mt-6 font-display text-3xl leading-snug tracking-tight md:text-4xl">
              “{CEO_MESSAGE.quote}”
            </blockquote>
            <div className="mt-10 space-y-5 text-base leading-relaxed text-white/70">
              {CEO_MESSAGE.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-10 label-caps text-white/55">
              {CEO_MESSAGE.name} · {CEO_MESSAGE.title}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <Reveal>
            <p className="label-caps text-muted-foreground">People</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
              Meet the team
            </h2>
            <p className="mt-5 max-w-xl text-muted-foreground">
              Advisors selected for judgement, discretion, and a shared standard
              of visual and commercial craft.
            </p>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            {TEAM.map((member, index) => (
              <Reveal
                key={member.name}
                delayMs={index * 80}
                className="grid gap-6 sm:grid-cols-[0.85fr_1.15fr] sm:items-end"
              >
                <div className="overflow-hidden bg-muted">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-display text-3xl tracking-tight">
                    {member.name}
                  </h3>
                  <p className="mt-2 label-caps text-muted-foreground">
                    {member.role}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-16">
            <TextLink to={ROUTES.contact.root()}>Work with the team</TextLink>
          </div>
        </div>
      </section>
    </div>
  );
}
