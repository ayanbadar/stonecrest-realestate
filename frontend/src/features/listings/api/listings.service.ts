import { api } from "@/lib/api";
import { documentsService } from "@/features/documents/api/documents.service";
import type {
  ListingFilters,
  PaginatedResponse,
  PropertyDetail,
  PropertyListItem,
  ResidenceWritePayload,
} from "@/features/listings/types";

function toParams(filters: ListingFilters = {}) {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.property_type) params.property_type = filters.property_type;
  if (filters.beds) params.beds = filters.beds;
  if (filters.baths) params.baths = filters.baths;
  if (filters.min_price) params.min_price = filters.min_price;
  if (filters.max_price) params.max_price = filters.max_price;
  if (filters.min_area) params.min_area = filters.min_area;
  if (filters.max_area) params.max_area = filters.max_area;
  if (filters.community) params.community = filters.community;
  if (filters.city) params.city = filters.city;
  if (filters.featured) params.featured = "true";
  if (filters.mine) params.mine = "true";
  if (filters.is_published === true) params.is_published = "true";
  if (filters.is_published === false) params.is_published = "false";
  if (filters.ordering) params.ordering = filters.ordering;
  if (filters.page) params.page = String(filters.page);
  if (filters.page_size) params.page_size = String(filters.page_size);
  return params;
}

type ResidenceJsonBody = {
  title?: string;
  status?: string;
  property_type?: string;
  price?: string | number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  community?: string;
  city?: string;
  short_description?: string;
  description?: string;
  is_featured?: boolean;
  is_published?: boolean;
  cover_document_id?: number | null;
  gallery_document_ids?: number[];
};

async function toJsonBody(
  payload: ResidenceWritePayload | Partial<ResidenceWritePayload>,
): Promise<ResidenceJsonBody> {
  const body: ResidenceJsonBody = {};

  if (payload.title !== undefined) body.title = payload.title;
  if (payload.status !== undefined) body.status = payload.status;
  if (payload.property_type !== undefined) body.property_type = payload.property_type;
  if (payload.price !== undefined) body.price = payload.price;
  if (payload.currency !== undefined) body.currency = payload.currency;
  if (payload.bedrooms !== undefined) body.bedrooms = payload.bedrooms;
  if (payload.bathrooms !== undefined) body.bathrooms = payload.bathrooms;
  if (payload.area_sqft !== undefined) body.area_sqft = payload.area_sqft;
  if (payload.community !== undefined) body.community = payload.community;
  if (payload.city !== undefined) body.city = payload.city;
  if (payload.short_description !== undefined) {
    body.short_description = payload.short_description;
  }
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.is_featured !== undefined) body.is_featured = payload.is_featured;
  if (payload.is_published !== undefined) body.is_published = payload.is_published;

  if (payload.cover_image instanceof File) {
    const cover = await documentsService.upload(payload.cover_image, "residencies");
    body.cover_document_id = cover.id;
  }

  if (payload.gallery && payload.gallery.length > 0) {
    const uploaded = await Promise.all(
      payload.gallery.map((file) =>
        documentsService.upload(file, "residencies"),
      ),
    );
    body.gallery_document_ids = uploaded.map((doc) => doc.id);
  }

  return body;
}

export const listingsService = {
  async list(
    filters: ListingFilters = {},
  ): Promise<PaginatedResponse<PropertyListItem>> {
    const { data } = await api.get<PaginatedResponse<PropertyListItem>>(
      "/residencies/",
      { params: toParams(filters) },
    );
    return data;
  },

  async getBySlug(slug: string): Promise<PropertyDetail> {
    const { data } = await api.get<PropertyDetail>(`/residencies/${slug}/`);
    return data;
  },

  async create(payload: ResidenceWritePayload): Promise<PropertyDetail> {
    const body = await toJsonBody(payload);
    const { data } = await api.post<PropertyDetail>("/residencies/", body);
    return data;
  },

  async update(
    slug: string,
    payload: ResidenceWritePayload | Partial<ResidenceWritePayload>,
  ): Promise<PropertyDetail> {
    const body = await toJsonBody(payload);
    const { data } = await api.patch<PropertyDetail>(
      `/residencies/${slug}/`,
      body,
    );
    return data;
  },

  async remove(slug: string): Promise<void> {
    await api.delete(`/residencies/${slug}/`);
  },
};
