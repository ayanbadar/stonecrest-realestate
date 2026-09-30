from django.contrib import admin

from apps.notifications.models import OutboundEmail


@admin.register(OutboundEmail)
class OutboundEmailAdmin(admin.ModelAdmin):
    list_display = ("kind", "subject", "recipient_list", "status", "attempts", "created_at")
    list_filter = ("kind", "status", "created_at")
    search_fields = ("subject", "error")
    readonly_fields = (
        "kind",
        "subject",
        "recipients",
        "reply_to",
        "text_body",
        "html_body",
        "status",
        "error",
        "attempts",
        "created_at",
        "updated_at",
        "sent_at",
    )

    @admin.display(description="Recipients")
    def recipient_list(self, obj: OutboundEmail) -> str:
        return ", ".join(obj.recipients or [])

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
