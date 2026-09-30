from rest_framework import serializers

from apps.inquiries.models import Inquiry
from apps.residencies.models import Property


class InquiryCreateSerializer(serializers.ModelSerializer):
    property_slug = serializers.SlugField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = Inquiry
        fields = (
            "id",
            "name",
            "email",
            "phone",
            "message",
            "property_slug",
            "status",
            "created_at",
        )
        read_only_fields = ("id", "status", "created_at")

    def create(self, validated_data):
        property_slug = validated_data.pop("property_slug", "").strip()
        listing = None
        if property_slug:
            listing = Property.objects.filter(
                slug=property_slug,
                is_published=True,
            ).first()
        return Inquiry.objects.create(listing=listing, **validated_data)


class InquiryListSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(
        source="listing.title",
        read_only=True,
        default="",
    )
    property_slug = serializers.CharField(
        source="listing.slug",
        read_only=True,
        default="",
    )
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Inquiry
        fields = (
            "id",
            "name",
            "email",
            "phone",
            "message",
            "status",
            "status_label",
            "property_title",
            "property_slug",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields


class InquiryStatusSerializer(serializers.ModelSerializer):
    status_label = serializers.CharField(source="get_status_display", read_only=True)
    property_title = serializers.CharField(
        source="listing.title",
        read_only=True,
        default="",
    )
    property_slug = serializers.CharField(
        source="listing.slug",
        read_only=True,
        default="",
    )

    class Meta:
        model = Inquiry
        fields = (
            "id",
            "name",
            "email",
            "phone",
            "message",
            "status",
            "status_label",
            "property_title",
            "property_slug",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "name",
            "email",
            "phone",
            "message",
            "status_label",
            "property_title",
            "property_slug",
            "created_at",
            "updated_at",
        )
