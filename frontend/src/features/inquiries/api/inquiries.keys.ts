export const inquiryKeys = {
  all: ["inquiries"] as const,
  lists: () => [...inquiryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...inquiryKeys.lists(), filters] as const,
};
