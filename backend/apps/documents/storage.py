"""
Document storage helpers.

Default Django STORAGES["default"] is already local or S3 based on ENVIRONMENT.
Use these helpers when you need the active backend explicitly.
"""

from django.conf import settings
from django.core.files.storage import default_storage, storages


def use_s3() -> bool:
    return bool(getattr(settings, "USE_S3", False))


def get_document_storage():
    """Return the configured default media storage (local or S3)."""
    try:
        return storages["default"]
    except Exception:
        return default_storage
