import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listingKeys } from "@/features/listings/api/listings.keys";
import { listingsService } from "@/features/listings/api/listings.service";
import type {
  ListingFilters,
  ResidenceWritePayload,
} from "@/features/listings/types";

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: listingKeys.list(filters as Record<string, unknown>),
    queryFn: () => listingsService.list(filters),
  });
}

export function useListing(slug: string) {
  return useQuery({
    queryKey: listingKeys.detail(slug),
    queryFn: () => listingsService.getBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCreateResidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResidenceWritePayload) =>
      listingsService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}

export function useUpdateResidence(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ResidenceWritePayload>) =>
      listingsService.update(slug, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(listingKeys.detail(data.slug), data);
      void queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
    },
  });
}

export function useDeleteResidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => listingsService.remove(slug),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}
