from decimal import Decimal, InvalidOperation

from django.db.models import Q
from rest_framework import generics

from apps.residencies.models import Property
from apps.residencies.pagination import ResidencePagination
from apps.residencies.permissions import IsOwnerOrStaffOrReadOnly
from apps.residencies.serializers import (
    RESIDENCY_PARSERS,
    PropertyDetailSerializer,
    PropertyListSerializer,
)

ORDERING_MAP = {
    "price": "price",
    "-price": "-price",
    "created": "created_at",
    "-created": "-created_at",
    "area": "area_sqft",
    "-area": "-area_sqft",
    "title": "title",
    "-title": "-title",
}


def apply_residence_filters(qs, params, *, user=None):
    search = params.get("search", "").strip()
    if search:
        qs = qs.filter(
            Q(title__icontains=search)
            | Q(community__icontains=search)
            | Q(city__icontains=search)
            | Q(short_description__icontains=search)
            | Q(description__icontains=search)
        )

    status_value = params.get("status", "").strip().lower()
    if status_value in {choice.value for choice in Property.Status}:
        qs = qs.filter(status=status_value)

    property_type = params.get("property_type", "").strip().lower()
    if property_type in {choice.value for choice in Property.PropertyType}:
        qs = qs.filter(property_type=property_type)

    community = params.get("community", "").strip()
    if community:
        qs = qs.filter(community__icontains=community)

    city = params.get("city", "").strip()
    if city:
        qs = qs.filter(city__icontains=city)

    beds = params.get("beds", "").strip()
    if beds.isdigit():
        qs = qs.filter(bedrooms__gte=int(beds))

    baths = params.get("baths", "").strip()
    if baths.isdigit():
        qs = qs.filter(bathrooms__gte=int(baths))

    featured = params.get("featured", "").strip().lower()
    if featured in {"1", "true", "yes"}:
        qs = qs.filter(is_featured=True)

    for key, lookup in (
        ("min_price", "price__gte"),
        ("max_price", "price__lte"),
    ):
        raw = params.get(key, "").strip()
        if raw:
            try:
                qs = qs.filter(**{lookup: Decimal(raw)})
            except InvalidOperation:
                pass

    for key, lookup in (
        ("min_area", "area_sqft__gte"),
        ("max_area", "area_sqft__lte"),
    ):
        raw = params.get(key, "").strip()
        if raw.isdigit():
            qs = qs.filter(**{lookup: int(raw)})

    mine = params.get("mine", "").strip().lower() in {"1", "true", "yes"}
    if mine and user and user.is_authenticated:
        qs = qs.filter(created_by=user)
    else:
        published = params.get("is_published", "").strip().lower()
        if published in {"1", "true", "yes"}:
            qs = qs.filter(is_published=True)
        elif published in {"0", "false", "no"}:
            if user and user.is_staff:
                qs = qs.filter(is_published=False)
            else:
                qs = qs.filter(is_published=True)
        else:
            if not (user and user.is_staff):
                qs = qs.filter(is_published=True)

    ordering = params.get("ordering", "").strip()
    if ordering in ORDERING_MAP:
        qs = qs.order_by(ORDERING_MAP[ordering], "-id")

    return qs


class PropertyListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsOwnerOrStaffOrReadOnly]
    pagination_class = ResidencePagination
    parser_classes = RESIDENCY_PARSERS

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PropertyDetailSerializer
        return PropertyListSerializer

    def get_queryset(self):
        qs = Property.objects.select_related("created_by", "cover_document")
        return apply_residence_filters(
            qs,
            self.request.query_params,
            user=self.request.user,
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrStaffOrReadOnly]
    serializer_class = PropertyDetailSerializer
    parser_classes = RESIDENCY_PARSERS
    lookup_field = "slug"

    def get_queryset(self):
        qs = (
            Property.objects.select_related("created_by", "cover_document")
            .prefetch_related("images__document")
        )
        user = self.request.user
        if self.request.method == "GET":
            if user and user.is_authenticated:
                if user.is_staff:
                    return qs
                return qs.filter(Q(is_published=True) | Q(created_by=user))
            return qs.filter(is_published=True)
        if user and user.is_staff:
            return qs
        return qs.filter(created_by=user)
