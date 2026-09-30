from django.urls import path

from apps.residencies.views import PropertyDetailView, PropertyListCreateView

urlpatterns = [
    path("residencies/", PropertyListCreateView.as_view(), name="residence-list"),
    path(
        "residencies/<slug:slug>/",
        PropertyDetailView.as_view(),
        name="residence-detail",
    ),
]
