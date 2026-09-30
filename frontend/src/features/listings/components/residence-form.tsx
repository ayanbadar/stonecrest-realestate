import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TextButton } from "@/components/brand/text-link";
import { ApiError } from "@/lib/api";
import type {
  PropertyDetail,
  PropertyStatus,
  PropertyType,
  ResidenceWritePayload,
} from "@/features/listings/types";

const fieldClass =
  "mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground";

const fileFieldClass =
  "mt-3 block w-full text-sm text-muted-foreground file:mr-4 file:border-0 file:bg-foreground file:px-4 file:py-2.5 file:label-caps file:text-background";

const residenceSchema = z.object({
  title: z.string().min(3, "Enter a title"),
  status: z.enum(["sale", "rent"]),
  property_type: z.enum([
    "apartment",
    "villa",
    "penthouse",
    "townhouse",
    "land",
  ]),
  price: z.string().min(1, "Enter a price"),
  currency: z.string().min(1),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  area_sqft: z.number().int().min(0),
  community: z.string().min(2, "Enter a community"),
  city: z.string().min(2, "Enter a city"),
  short_description: z.string().min(1, "Add a short description"),
  description: z.string().min(1, "Add a description"),
  is_featured: z.boolean(),
  is_published: z.boolean(),
});

type ResidenceFormValues = z.infer<typeof residenceSchema>;

type ResidenceFormProps = {
  initial?: PropertyDetail | null;
  submitLabel: string;
  isPending?: boolean;
  error?: unknown;
  requireCover?: boolean;
  onSubmit: (payload: ResidenceWritePayload) => Promise<void> | void;
};

function toFormValues(initial?: PropertyDetail | null): ResidenceFormValues {
  return {
    title: initial?.title ?? "",
    status: (initial?.status ?? "sale") as PropertyStatus,
    property_type: (initial?.property_type ?? "apartment") as PropertyType,
    price: initial?.price ?? "",
    currency: initial?.currency ?? "AED",
    bedrooms: initial?.bedrooms ?? 0,
    bathrooms: initial?.bathrooms ?? 0,
    area_sqft: initial?.area_sqft ?? 0,
    community: initial?.community ?? "",
    city: initial?.city ?? "Dubai",
    short_description: initial?.short_description ?? "",
    description: initial?.description ?? "",
    is_featured: initial?.is_featured ?? false,
    is_published: initial?.is_published ?? true,
  };
}

function filesFromList(list: FileList | null): File[] {
  if (!list?.length) return [];
  return Array.from(list);
}

export function ResidenceForm({
  initial,
  submitLabel,
  isPending = false,
  error,
  requireCover = !initial,
  onSubmit,
}: ResidenceFormProps) {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [coverError, setCoverError] = useState<string | null>(null);

  const form = useForm<ResidenceFormValues>({
    resolver: zodResolver(residenceSchema),
    defaultValues: toFormValues(initial),
  });

  useEffect(() => {
    form.reset(toFormValues(initial));
    setCoverImage(null);
    setGalleryFiles([]);
    setCoverError(null);
  }, [initial, form]);

  const coverPreview = useMemo(() => {
    if (coverImage) return URL.createObjectURL(coverImage);
    return initial?.cover_url || "";
  }, [coverImage, initial?.cover_url]);

  useEffect(() => {
    if (!coverImage) return;
    return () => URL.revokeObjectURL(coverPreview);
  }, [coverImage, coverPreview]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (requireCover && !coverImage && !initial?.cover_url) {
      setCoverError("Please choose a cover image.");
      return;
    }
    setCoverError(null);

    await onSubmit({
      title: values.title,
      status: values.status,
      property_type: values.property_type,
      price: values.price,
      currency: values.currency,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      area_sqft: values.area_sqft,
      community: values.community,
      city: values.city,
      short_description: values.short_description,
      description: values.description,
      cover_image: coverImage,
      gallery: galleryFiles,
      is_featured: values.is_featured,
      is_published: values.is_published,
    });
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <label className="block">
        <span className="label-caps text-muted-foreground">Title</span>
        <input className={fieldClass} {...form.register("title")} />
        {form.formState.errors.title ? (
          <p className="mt-2 text-xs text-destructive">
            {form.formState.errors.title.message}
          </p>
        ) : null}
      </label>

      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="label-caps text-muted-foreground">Status</span>
          <select className={fieldClass} {...form.register("status")}>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </label>
        <label className="block">
          <span className="label-caps text-muted-foreground">Type</span>
          <select className={fieldClass} {...form.register("property_type")}>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
          </select>
        </label>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="label-caps text-muted-foreground">Price</span>
          <input className={fieldClass} inputMode="decimal" {...form.register("price")} />
          {form.formState.errors.price ? (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.price.message}
            </p>
          ) : null}
        </label>
        <label className="block">
          <span className="label-caps text-muted-foreground">Currency</span>
          <input className={fieldClass} {...form.register("currency")} />
        </label>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <label className="block">
          <span className="label-caps text-muted-foreground">Bedrooms</span>
          <input
            type="number"
            min={0}
            className={fieldClass}
            {...form.register("bedrooms", { valueAsNumber: true })}
          />
        </label>
        <label className="block">
          <span className="label-caps text-muted-foreground">Bathrooms</span>
          <input
            type="number"
            min={0}
            className={fieldClass}
            {...form.register("bathrooms", { valueAsNumber: true })}
          />
        </label>
        <label className="block">
          <span className="label-caps text-muted-foreground">Area (sq.ft)</span>
          <input
            type="number"
            min={0}
            className={fieldClass}
            {...form.register("area_sqft", { valueAsNumber: true })}
          />
        </label>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="label-caps text-muted-foreground">Community</span>
          <input className={fieldClass} {...form.register("community")} />
          {form.formState.errors.community ? (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.community.message}
            </p>
          ) : null}
        </label>
        <label className="block">
          <span className="label-caps text-muted-foreground">City</span>
          <input className={fieldClass} {...form.register("city")} />
        </label>
      </div>

      <label className="block">
        <span className="label-caps text-muted-foreground">Short description</span>
        <textarea
          rows={3}
          className={`${fieldClass} resize-y`}
          {...form.register("short_description")}
        />
        {form.formState.errors.short_description ? (
          <p className="mt-2 text-xs text-destructive">
            {form.formState.errors.short_description.message}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="label-caps text-muted-foreground">Description</span>
        <textarea
          rows={8}
          className={`${fieldClass} resize-y`}
          {...form.register("description")}
        />
        {form.formState.errors.description ? (
          <p className="mt-2 text-xs text-destructive">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </label>

      <div className="block">
        <span className="label-caps text-muted-foreground">Cover image</span>
        {coverPreview ? (
          <div className="mt-3 overflow-hidden bg-muted aspect-[16/10]">
            <img
              src={coverPreview}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
        <input
          type="file"
          accept="image/*"
          className={fileFieldClass}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setCoverImage(file);
            setCoverError(null);
          }}
        />
        {initial?.cover_url && !coverImage ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Leave empty to keep the current cover image.
          </p>
        ) : null}
        {coverError ? (
          <p className="mt-2 text-xs text-destructive">{coverError}</p>
        ) : null}
      </div>

      <div className="block">
        <span className="label-caps text-muted-foreground">Gallery images</span>
        {initial?.images?.length && galleryFiles.length === 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {initial.images.map((image) => (
              <div key={image.id} className="overflow-hidden bg-muted aspect-square">
                <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        ) : null}
        {galleryFiles.length > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {galleryFiles.length} image{galleryFiles.length === 1 ? "" : "s"} selected
          </p>
        ) : null}
        <input
          type="file"
          accept="image/*"
          multiple
          className={fileFieldClass}
          onChange={(event) => {
            setGalleryFiles(filesFromList(event.target.files));
          }}
        />
        {initial?.images?.length ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Choosing new gallery images replaces the current gallery.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-8">
        <label className="inline-flex items-center gap-3 text-sm">
          <input type="checkbox" {...form.register("is_featured")} />
          Featured
        </label>
        <label className="inline-flex items-center gap-3 text-sm">
          <input type="checkbox" {...form.register("is_published")} />
          Published
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <TextButton type="submit" tone="dark" disabled={isPending}>
          {isPending ? "Saving…" : submitLabel}
        </TextButton>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error instanceof ApiError
              ? error.message
              : "Unable to save residence."}
          </p>
        ) : null}
      </div>
    </form>
  );
}
