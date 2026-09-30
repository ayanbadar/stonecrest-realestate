import { Link } from "react-router-dom";

import { Reveal } from "@/components/motion/reveal";
import { ROUTES } from "@/constants/routes";
import type { PropertyListItem } from "@/features/listings/types";
import {
  formatArea,
  formatPrice,
  statusLabel,
} from "@/features/listings/utils/format";
import { cn } from "@/lib/utils";

type PropertyTileProps = {
  property: PropertyListItem;
  className?: string;
  priority?: boolean;
  layout?: "standard" | "tall" | "wide";
};

export function PropertyTile({
  property,
  className,
  priority = false,
  layout = "standard",
}: PropertyTileProps) {
  return (
    <Reveal
      as="article"
      className={cn(
        "group/media",
        layout === "tall" && "md:row-span-2",
        layout === "wide" && "md:col-span-2",
        className,
      )}
    >
      <Link
        to={ROUTES.listings.detail(property.slug)}
        className="block outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            layout === "tall" ? "aspect-[3/4] md:h-full md:min-h-[36rem]" : "aspect-[4/3]",
            layout === "wide" && "aspect-[16/9] md:aspect-[21/9]",
          )}
        >
          {property.cover_url ? (
            <img
              src={property.cover_url}
              alt={property.title}
              className="img-cover img-scale"
              loading={priority ? "eager" : "lazy"}
            />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5 md:p-6">
            <p className="label-caps text-white/70">{statusLabel(property.status)}</p>
            <h3 className="mt-2 font-display text-2xl tracking-tight text-white md:text-3xl">
              {property.title}
            </h3>
            <p className="mt-2 text-sm text-white/75">
              {property.community}, {property.city}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-lg tracking-tight">{formatPrice(property.price, property.currency)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {property.bedrooms} bed · {property.bathrooms} bath ·{" "}
              {formatArea(property.area_sqft)}
            </p>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
