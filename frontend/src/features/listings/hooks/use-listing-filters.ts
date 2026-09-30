import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import type { FormEvent } from "react";

import type { ListingFilters, PropertyType } from "@/features/listings/types";

const filterParsers = {
  q: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  type: parseAsString.withDefault(""),
  beds: parseAsString.withDefault(""),
  baths: parseAsString.withDefault(""),
  minPrice: parseAsString.withDefault(""),
  maxPrice: parseAsString.withDefault(""),
  minArea: parseAsString.withDefault(""),
  maxArea: parseAsString.withDefault(""),
  community: parseAsString.withDefault(""),
  city: parseAsString.withDefault(""),
  ordering: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

export function useListingFilters() {
  const [params, setParams] = useQueryStates(filterParsers, {
    history: "replace",
    shallow: false,
  });

  const filters: ListingFilters = {
    search: params.q || undefined,
    status: (params.status as ListingFilters["status"]) || undefined,
    property_type: (params.type as PropertyType | "") || undefined,
    beds: params.beds || undefined,
    baths: params.baths || undefined,
    min_price: params.minPrice || undefined,
    max_price: params.maxPrice || undefined,
    min_area: params.minArea || undefined,
    max_area: params.maxArea || undefined,
    community: params.community || undefined,
    city: params.city || undefined,
    ordering: params.ordering || undefined,
    page: params.page || 1,
    page_size: 12,
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void setParams({
      q: String(form.get("q") ?? ""),
      status: String(form.get("status") ?? ""),
      type: String(form.get("type") ?? ""),
      beds: String(form.get("beds") ?? ""),
      baths: String(form.get("baths") ?? ""),
      minPrice: String(form.get("minPrice") ?? ""),
      maxPrice: String(form.get("maxPrice") ?? ""),
      minArea: String(form.get("minArea") ?? ""),
      maxArea: String(form.get("maxArea") ?? ""),
      community: String(form.get("community") ?? ""),
      city: String(form.get("city") ?? ""),
      ordering: String(form.get("ordering") ?? ""),
      page: 1,
    });
  };

  const clear = () => {
    void setParams({
      q: "",
      status: "",
      type: "",
      beds: "",
      baths: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      community: "",
      city: "",
      ordering: "",
      page: 1,
    });
  };

  const setPage = (page: number) => {
    void setParams({ page });
  };

  return { params, filters, onSubmit, clear, setParams, setPage };
}
