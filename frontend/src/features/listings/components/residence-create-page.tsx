import { useNavigate } from "react-router-dom";

import { Reveal } from "@/components/motion/reveal";
import { ROUTES } from "@/constants/routes";
import { useCreateResidence } from "@/features/listings/api/listings.api";
import { ResidenceForm } from "@/features/listings/components/residence-form";

export function ResidenceCreatePage() {
  const navigate = useNavigate();
  const create = useCreateResidence();

  return (
    <div>
      <section className="container-editorial section-y">
        <Reveal className="mx-auto max-w-2xl">
          <p className="label-caps text-muted-foreground">Account</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            New residence.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Add a listing record to the residencies catalog.
          </p>
          <div className="mt-12">
            <ResidenceForm
              submitLabel="Create residence"
              isPending={create.isPending}
              error={create.error}
              onSubmit={async (payload) => {
                const created = await create.mutateAsync(payload);
                navigate(ROUTES.residencies.edit(created.slug), {
                  replace: true,
                });
              }}
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
