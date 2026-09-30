export type InquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "closed"
  | "archived";

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_slug?: string;
};

export type InquiryCreateResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
};

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  status_label: string;
  property_title: string;
  property_slug: string;
  created_at: string;
  updated_at: string;
};

export type InquiryFilters = {
  search?: string;
  status?: InquiryStatus | "";
  page?: number;
  page_size?: number;
};

export type PaginatedInquiries = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Inquiry[];
};

export const INQUIRY_STATUS_OPTIONS: {
  value: InquiryStatus;
  label: string;
}[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In progress" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
];
