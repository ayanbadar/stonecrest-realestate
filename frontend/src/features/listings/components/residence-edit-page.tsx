import { useNavigate, useParams } from "react-router-dom";

import { QueryState } from "@/components/query-state";
import { Reveal } from "@/components/motion/reveal";
import { ROUTES } from "@/constants/routes";
import {
  useListing,
  useUpdateResidence,
} from "@/features/listings/api/listings.api";
import { ResidenceForm } from "@/features/listings/components/residence-form";

export function ResidenceEditPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const query = useListing(slug);
  const update = useUpdateResidence(slug);

  return (
    <div>
      <section className="container-editorial section-y">
        <Reveal className="mx-auto max-w-2xl">
          <p className="label-caps text-muted-foreground">Account</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Edit residence.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Update listing details, media, and publication state.
          </p>

          <div className="mt-12">
            <QueryState
              isLoading={query.isLoading}
              isError={query.isError}
              isEmpty={!query.isLoading && !query.data}
              errorMessage="Unable to load this residence."
              emptyMessage="Residence not found."
              onRetry={() => void query.refetch()}
            >
              {query.data ? (
                <ResidenceForm
                  initial={query.data}
                  submitLabel="Save changes"
                  isPending={update.isPending}
                  error={update.error}
                  onSubmit={async (payload) => {
                    const saved = await update.mutateAsync(payload);
                    navigate(ROUTES.residencies.edit(saved.slug), {
                      replace: true,
                    });
                  }}
                />
              ) : null}
            </QueryState>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
