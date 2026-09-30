from django.db import models


class OutboundEmail(models.Model):
    """Record of an email handed to the background worker."""

    class Kind(models.TextChoices):
        PASSWORD_RESET = "password_reset", "Password reset"
        INQUIRY_TEAM = "inquiry_team", "Inquiry notification"
        INQUIRY_CONFIRMATION = "inquiry_confirmation", "Inquiry confirmation"

    class Status(models.TextChoices):
        QUEUED = "queued", "Queued"
        SENDING = "sending", "Sending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    kind = models.CharField(max_length=40, choices=Kind.choices)
    subject = models.CharField(max_length=255)
    recipients = models.JSONField(default=list)
    reply_to = models.JSONField(default=list, blank=True)
    text_body = models.TextField(blank=True)
    html_body = models.TextField(blank=True)
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.QUEUED,
    )
    error = models.TextField(blank=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.get_kind_display()} to {', '.join(self.recipients)}"
