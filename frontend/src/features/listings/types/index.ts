export type PropertyStatus = "sale" | "rent";

export type PropertyType =
  | "apartment"
  | "villa"
  | "penthouse"
  | "townhouse"
  | "land";

export type PropertyListItem = {
  id: number;
  title: string;
  slug: string;
  status: PropertyStatus;
  property_type: PropertyType;
  price: string;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  community: string;
  city: string;
  short_description: string;
  cover_document_id: number | null;
  cover_url: string;
  is_featured: boolean;
  is_published: boolean;
  created_by: number | null;
  created_by_username: string;
  created_at: string;
  updated_at: string;
};

export type PropertyImage = {
  id: number;
  document_id: number;
  url: string;
  alt: string;
  sort_order: number;
};

export type PropertyDetail = PropertyListItem & {
  description: string;
  images: PropertyImage[];
};

export type ListingFilters = {
  search?: string;
  status?: PropertyStatus | "";
  property_type?: PropertyType | "";
  beds?: string;
  baths?: string;
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
  community?: string;
  city?: string;
  featured?: boolean;
  mine?: boolean;
  is_published?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ResidenceWritePayload = {
  title: string;
  status: PropertyStatus;
  property_type: PropertyType;
  price: string | number;
  currency?: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  community: string;
  city?: string;
  short_description: string;
  description: string;
  cover_image?: File | null;
  gallery?: File[];
  is_featured?: boolean;
  is_published?: boolean;
};
