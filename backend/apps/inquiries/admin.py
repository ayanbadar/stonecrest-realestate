from django.contrib import admin

from apps.inquiries.models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "status", "listing", "created_at", "updated_at")
    list_filter = ("status", "created_at")
    search_fields = ("name", "email", "phone", "message")
    readonly_fields = (
        "name",
        "email",
        "phone",
        "message",
        "listing",
        "created_at",
        "updated_at",
    )
    list_editable = ("status",)
    raw_id_fields = ("listing",)

    def has_add_permission(self, request):
        return False
