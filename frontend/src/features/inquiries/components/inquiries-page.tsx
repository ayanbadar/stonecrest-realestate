import { useState } from "react";
import { Link } from "react-router-dom";

import { QueryState } from "@/components/query-state";
import { Reveal } from "@/components/motion/reveal";
import { ROUTES } from "@/constants/routes";
import {
  useInquiries,
  useUpdateInquiryStatus,
} from "@/features/inquiries/api/inquiries.api";
import {
  INQUIRY_STATUS_OPTIONS,
  type InquiryStatus,
} from "@/features/inquiries/types";

const selectClass =
  "mt-1 border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors focus:border-foreground";

function formatReceivedAt(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function InquiriesPage() {
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "">("");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const query = useInquiries({
    status: statusFilter,
    search: submittedSearch || undefined,
    page_size: 50,
  });
  const updateStatus = useUpdateInquiryStatus();
  const items = query.data?.results ?? [];

  return (
    <div>
      <section className="container-editorial section-y">
        <Reveal className="flex flex-col justify-between gap-8 border-b border-border pb-12 md:flex-row md:items-end">
          <div>
            <p className="label-caps text-muted-foreground">Account</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Enquiries.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Review private consultation requests and update their status as
              conversations progress.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <form
            className="flex flex-1 flex-col gap-4 md:max-w-md md:flex-row md:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedSearch(search.trim());
            }}
          >
            <label className="flex-1 text-sm text-muted-foreground">
              Search
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, email, message…"
                className="mt-2 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-foreground"
              />
            </label>
            <button
              type="submit"
              className="label-caps self-start text-foreground transition-opacity hover:opacity-70 md:self-auto"
            >
              Apply
            </button>
          </form>

          <label className="text-sm text-muted-foreground">
            Status
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as InquiryStatus | "")
              }
              className={selectClass}
            >
              <option value="">All</option>
              {INQUIRY_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-10">
          <QueryState
            isLoading={query.isLoading}
            isError={query.isError}
            isEmpty={!query.isLoading && items.length === 0}
            errorMessage="Unable to load enquiries."
            emptyMessage="No enquiries match these filters."
            onRetry={() => void query.refetch()}
          >
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li key={item.id} className="grid gap-6 py-8 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="label-caps text-muted-foreground">
                      {formatReceivedAt(item.created_at)}
                      {item.property_title ? ` · ${item.property_title}` : ""}
                    </p>
                    <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
                      {item.name}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <a
                        href={`mailto:${item.email}`}
                        className="transition-opacity hover:opacity-70"
                      >
                        {item.email}
                      </a>
                      {item.phone ? ` · ${item.phone}` : ""}
                    </p>
                    <p className="mt-5 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                      {item.message}
                    </p>
                    {item.property_slug ? (
                      <Link
                        to={ROUTES.listings.detail(item.property_slug)}
                        className="mt-4 inline-block label-caps text-muted-foreground transition-opacity hover:opacity-70"
                      >
                        View residence
                      </Link>
                    ) : null}
                  </div>

                  <div className="lg:justify-self-end">
                    <label className="block text-sm text-muted-foreground">
                      Status
                      <select
                        value={item.status}
                        disabled={updateStatus.isPending}
                        onChange={(event) => {
                          void updateStatus.mutateAsync({
                            id: item.id,
                            status: event.target.value as InquiryStatus,
                          });
                        }}
                        className={`${selectClass} w-full min-w-[12rem]`}
                      >
                        {INQUIRY_STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
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
