from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health, name="health"),
    path("api/auth/", include("apps.users.urls")),
    path("api/documents/", include("apps.documents.urls")),
    path("api/inquiries/", include("apps.inquiries.urls")),
    path("api/", include("apps.residencies.urls")),
]

# Serve uploaded media from local disk in local/dev environments.
if not getattr(settings, "USE_S3", False):
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
