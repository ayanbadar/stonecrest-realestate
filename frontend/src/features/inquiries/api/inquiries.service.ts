import { api } from "@/lib/api";
import type {
  Inquiry,
  InquiryCreateResponse,
  InquiryFilters,
  InquiryPayload,
  InquiryStatus,
  PaginatedInquiries,
} from "@/features/inquiries/types";

function toParams(filters: InquiryFilters = {}) {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.page) params.page = String(filters.page);
  if (filters.page_size) params.page_size = String(filters.page_size);
  return params;
}

export const inquiriesService = {
  async create(payload: InquiryPayload): Promise<InquiryCreateResponse> {
    const { data } = await api.post<InquiryCreateResponse>("/inquiries/", payload);
    return data;
  },

  async list(filters: InquiryFilters = {}): Promise<PaginatedInquiries> {
    const { data } = await api.get<PaginatedInquiries>("/inquiries/", {
      params: toParams(filters),
    });
    return data;
  },

  async updateStatus(id: number, status: InquiryStatus): Promise<Inquiry> {
    const { data } = await api.patch<Inquiry>(`/inquiries/${id}/`, { status });
    return data;
  },
};
