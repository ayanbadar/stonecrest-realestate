from pathlib import Path
from uuid import uuid4

from django.conf import settings
from django.db import models
from django.utils import timezone


def document_upload_to(instance: "Document", filename: str) -> str:
    ext = Path(filename).suffix.lower()[:16]
    folder = (instance.folder or "general").strip("/").replace("..", "")
    date_path = timezone.now().strftime("%Y/%m")
    return f"documents/{folder}/{date_path}/{uuid4().hex}{ext}"


class Document(models.Model):
    """
    Central registry for uploaded files.
    Physical storage is local MEDIA_ROOT when ENVIRONMENT=local, otherwise S3.
    """

    file = models.FileField(upload_to=document_upload_to, max_length=512)
    original_name = models.CharField(max_length=255)
    content_type = models.CharField(max_length=128, blank=True)
    size = models.PositiveBigIntegerField(default=0)
    folder = models.CharField(
        max_length=64,
        default="general",
        help_text="Logical folder under documents/ (e.g. listings, avatars).",
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="documents",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.original_name

    @property
    def url(self) -> str:
        if not self.file:
            return ""
        return self.file.url

    def save(self, *args, **kwargs):
        if self.file and not self.original_name:
            self.original_name = Path(self.file.name).name
        if self.file and not self.size:
            try:
                self.size = self.file.size
            except (OSError, ValueError):
                self.size = 0
        if self.file and not self.content_type:
            content_type = getattr(self.file, "content_type", "") or ""
            self.content_type = content_type[:128]
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        storage = self.file.storage
        name = self.file.name
        super().delete(*args, **kwargs)
        if name:
            storage.delete(name)
