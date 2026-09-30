import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { inquiryKeys } from "@/features/inquiries/api/inquiries.keys";
import { inquiriesService } from "@/features/inquiries/api/inquiries.service";
import type {
  InquiryFilters,
  InquiryPayload,
  InquiryStatus,
} from "@/features/inquiries/types";

export function useCreateInquiry() {
  return useMutation({
    mutationFn: (payload: InquiryPayload) => inquiriesService.create(payload),
  });
}

export function useInquiries(filters: InquiryFilters = {}) {
  return useQuery({
    queryKey: inquiryKeys.list(filters as Record<string, unknown>),
    queryFn: () => inquiriesService.list(filters),
  });
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: InquiryStatus }) =>
      inquiriesService.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() });
    },
  });
}
