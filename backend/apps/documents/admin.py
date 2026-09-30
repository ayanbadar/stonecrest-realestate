from django.contrib import admin

from apps.documents.models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "original_name",
        "folder",
        "content_type",
        "size",
        "uploaded_by",
        "created_at",
    )
    list_filter = ("folder", "content_type", "created_at")
    search_fields = ("original_name", "file", "uploaded_by__username")
    readonly_fields = ("size", "content_type", "created_at", "updated_at")
    raw_id_fields = ("uploaded_by",)
