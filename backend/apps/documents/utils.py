from django.core.files.uploadedfile import UploadedFile
from django.db.models import Model

from apps.documents.models import Document


def create_document(
    upload: UploadedFile,
    *,
    folder: str = "general",
    user: Model | None = None,
) -> Document:
    """Save an uploaded file into the documents registry (local or S3)."""
    return Document.objects.create(
        file=upload,
        original_name=getattr(upload, "name", "") or "upload",
        content_type=getattr(upload, "content_type", "") or "",
        size=getattr(upload, "size", 0) or 0,
        folder=folder or "general",
        uploaded_by=user,
    )
