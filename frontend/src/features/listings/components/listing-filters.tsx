import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { TextButton } from "@/components/brand/text-link";
import { useListingFilters } from "@/features/listings/hooks/use-listing-filters";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full border-0 border-b border-border bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground";

type FilterParams = ReturnType<typeof useListingFilters>["params"];

const FILTER_KEYS = [
  "q",
  "status",
  "type",
  "beds",
  "baths",
  "minPrice",
  "maxPrice",
  "minArea",
  "maxArea",
  "community",
  "city",
  "ordering",
] as const satisfies readonly (keyof FilterParams)[];

function activeFilterCount(params: FilterParams) {
  return FILTER_KEYS.filter((key) => params[key] !== "").length;
}

function formKey(params: FilterParams) {
  return FILTER_KEYS.map((key) => params[key]).join("\0");
}

export function ListingFilters() {
  const { params, onSubmit, clear } = useListingFilters();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const active = activeFilterCount(params);

  const toggle = () => setOpen((value) => !value);
  const close = () => setOpen(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    onSubmit(event);
    if (!isDesktop) close();
  };

  useEffect(() => {
    if (isDesktop || !open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isDesktop, open]);

  return (
    <>
      <div className="sticky top-[4.5rem] z-30 border-y border-border bg-background/95 backdrop-blur-md lg:top-20">
        <div className="container-editorial flex items-center justify-between gap-4 py-4">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
            className="inline-flex items-center gap-3 label-caps text-foreground transition-opacity duration-300 hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden />
            Filters
            {active > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center border border-foreground px-1.5 py-0.5 text-[0.625rem] tracking-[0.14em]">
                {active}
              </span>
            ) : null}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {active > 0 && !open ? (
            <button
              type="button"
              onClick={clear}
              className="label-caps text-muted-foreground transition-opacity hover:opacity-70"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {isDesktop ? (
        <div
          id={panelId}
          className={cn(
            "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden" inert={open ? undefined : true}>
            <form
              key={formKey(params)}
              onSubmit={handleSubmit}
              className="border-b border-border bg-background"
            >
              <div className="container-editorial py-6">
                <FilterFields params={params} onClear={clear} showActions />
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {!isDesktop
        ? createPortal(
            <MobileFilterSheet
              open={open}
              panelId={panelId}
              titleId={titleId}
              formKey={formKey(params)}
              onClose={close}
              onClear={clear}
              onSubmit={handleSubmit}
            >
              <FilterFields params={params} />
            </MobileFilterSheet>,
            document.body,
          )
        : null}
    </>
  );
}

function MobileFilterSheet({
  open,
  panelId,
  titleId,
  formKey: key,
  onClose,
  onClear,
  onSubmit,
  children,
}: {
  open: boolean;
  panelId: string;
  titleId: string;
  formKey: string;
  onClose: () => void;
  onClear: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 top-[4.5rem] z-40",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        type="button"
        aria-label="Close filters"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-foreground/40 transition-opacity duration-500 motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={open ? undefined : true}
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[min(85dvh,100%)] flex-col bg-background shadow-[0_-12px_40px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex justify-center pt-3">
          <span className="h-1 w-10 bg-foreground/25" aria-hidden />
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <p id={titleId} className="label-caps text-foreground">
            Filters
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="inline-flex size-10 items-center justify-center text-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <form
          key={key}
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
            {children}
          </div>
          <div className="border-t border-border px-5 py-4">
            <FilterActions onClear={onClear} />
          </div>
        </form>
      </div>
    </div>
  );
}

function FilterFields({
  params,
  onClear,
  showActions = false,
}: {
  params: FilterParams;
  onClear?: () => void;
  showActions?: boolean;
}) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <label className="block xl:col-span-2">
          <span className="label-caps text-muted-foreground">Search</span>
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Community, residence…"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Status</span>
          <select name="status" defaultValue={params.status} className={fieldClass}>
            <option value="">Any</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Type</span>
          <select name="type" defaultValue={params.type} className={fieldClass}>
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
          </select>
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Beds</span>
          <select name="beds" defaultValue={params.beds} className={fieldClass}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Baths</span>
          <select name="baths" defaultValue={params.baths} className={fieldClass}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Min AED</span>
          <input
            name="minPrice"
            defaultValue={params.minPrice}
            inputMode="numeric"
            placeholder="0"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Max AED</span>
          <input
            name="maxPrice"
            defaultValue={params.maxPrice}
            inputMode="numeric"
            placeholder="Any"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Min sq.ft</span>
          <input
            name="minArea"
            defaultValue={params.minArea}
            inputMode="numeric"
            placeholder="0"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Max sq.ft</span>
          <input
            name="maxArea"
            defaultValue={params.maxArea}
            inputMode="numeric"
            placeholder="Any"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="label-caps text-muted-foreground">Sort</span>
          <select
            name="ordering"
            defaultValue={params.ordering}
            className={fieldClass}
          >
            <option value="">Featured</option>
            <option value="price">Price ↑</option>
            <option value="-price">Price ↓</option>
            <option value="-created">Newest</option>
            <option value="area">Area ↑</option>
            <option value="-area">Area ↓</option>
          </select>
        </label>
      </div>

      <div
        className={cn(
          "mt-6 grid gap-6 md:grid-cols-2",
          showActions && "lg:grid-cols-[1fr_1fr_auto] lg:items-end",
        )}
      >
        <label className="block">
          <span className="label-caps text-muted-foreground">Community</span>
          <input
            name="community"
            defaultValue={params.community}
            placeholder="e.g. Palm Jumeirah"
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="label-caps text-muted-foreground">City</span>
          <input
            name="city"
            defaultValue={params.city}
            placeholder="e.g. Dubai"
            className={fieldClass}
          />
        </label>
        {showActions ? <FilterActions onClear={onClear} /> : null}
      </div>
    </>
  );
}

function FilterActions({ onClear }: { onClear?: () => void }) {
  return (
    <div className="flex items-center gap-4">
      <TextButton type="submit" tone="dark">
        Apply filters
      </TextButton>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="label-caps text-muted-foreground transition-opacity hover:opacity-70"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
