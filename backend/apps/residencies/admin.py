from django.contrib import admin

from apps.residencies.models import Property, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ("document", "alt", "sort_order")
    raw_id_fields = ("document",)


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "status",
        "property_type",
        "community",
        "price",
        "is_featured",
        "is_published",
        "created_by",
    )
    list_filter = (
        "status",
        "property_type",
        "is_featured",
        "is_published",
        "community",
        "city",
    )
    search_fields = ("title", "community", "city", "slug")
    prepopulated_fields = {"slug": ("title",)}
    raw_id_fields = ("created_by", "cover_document")
    inlines = [PropertyImageInline]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "slug",
                    "status",
                    "property_type",
                    "is_featured",
                    "is_published",
                    "created_by",
                )
            },
        ),
        (
            "Pricing & specs",
            {
                "fields": (
                    "price",
                    "currency",
                    "bedrooms",
                    "bathrooms",
                    "area_sqft",
                )
            },
        ),
        ("Location", {"fields": ("community", "city")}),
        ("Copy", {"fields": ("short_description", "description")}),
        ("Media", {"fields": ("cover_document",)}),
    )
