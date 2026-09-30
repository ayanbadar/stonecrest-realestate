export const listingKeys = {
  all: ["residencies"] as const,
  lists: () => [...listingKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...listingKeys.lists(), filters] as const,
  details: () => [...listingKeys.all, "detail"] as const,
  detail: (slug: string) => [...listingKeys.details(), slug] as const,
};
