from rest_framework import serializers
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from apps.documents.models import Document
from apps.residencies.models import Property, PropertyImage

RESIDENCY_PARSERS = [MultiPartParser, FormParser, JSONParser]


def absolute_media_url(url: str, request) -> str:
    if not url:
        return ""
    if request and url.startswith("/"):
        return request.build_absolute_uri(url)
    return url


class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    document_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = PropertyImage
        fields = ("id", "document_id", "url", "alt", "sort_order")
        read_only_fields = ("id", "document_id", "url")

    def get_url(self, obj: PropertyImage) -> str:
        return absolute_media_url(obj.url, self.context.get("request"))


class PropertyListSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField()
    cover_document_id = serializers.IntegerField(
        read_only=True,
        allow_null=True,
    )
    created_by_username = serializers.CharField(
        source="created_by.username",
        read_only=True,
        default="",
    )

    class Meta:
        model = Property
        fields = (
            "id",
            "title",
            "slug",
            "status",
            "property_type",
            "price",
            "currency",
            "bedrooms",
            "bathrooms",
            "area_sqft",
            "community",
            "city",
            "short_description",
            "cover_document_id",
            "cover_url",
            "is_featured",
            "is_published",
            "created_by",
            "created_by_username",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "slug",
            "cover_document_id",
            "cover_url",
            "created_by",
            "created_by_username",
            "created_at",
            "updated_at",
        )

    def get_cover_url(self, obj: Property) -> str:
        return absolute_media_url(obj.cover_url, self.context.get("request"))


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    description = serializers.CharField()
    cover_document_id = serializers.PrimaryKeyRelatedField(
        source="cover_document",
        queryset=Document.objects.all(),
        required=False,
        allow_null=True,
    )
    gallery_document_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        write_only=True,
        allow_empty=True,
    )

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + (
            "description",
            "gallery_document_ids",
            "images",
        )
        read_only_fields = tuple(
            field
            for field in PropertyListSerializer.Meta.read_only_fields
            if field != "cover_document_id"
        ) + ("images",)

    def validate_gallery_document_ids(self, ids: list[int]) -> list[Document]:
        if not ids:
            return []
        docs = list(Document.objects.filter(id__in=ids))
        found = {doc.id for doc in docs}
        missing = [doc_id for doc_id in ids if doc_id not in found]
        if missing:
            raise serializers.ValidationError(
                f"Unknown document id(s): {', '.join(str(i) for i in missing)}"
            )
        # Preserve caller order
        by_id = {doc.id: doc for doc in docs}
        return [by_id[doc_id] for doc_id in ids]

    def _sync_gallery(self, listing: Property, documents: list[Document]) -> None:
        listing.images.all().delete()
        PropertyImage.objects.bulk_create(
            [
                PropertyImage(
                    listing=listing,
                    document=document,
                    alt=listing.title,
                    sort_order=index,
                )
                for index, document in enumerate(documents)
            ]
        )

    def create(self, validated_data):
        gallery_docs = validated_data.pop("gallery_document_ids", None)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data.setdefault("created_by", request.user)
        listing = Property.objects.create(**validated_data)
        if gallery_docs is not None:
            self._sync_gallery(listing, gallery_docs)
        return listing

    def update(self, instance, validated_data):
        gallery_docs = validated_data.pop("gallery_document_ids", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if gallery_docs is not None:
            self._sync_gallery(instance, gallery_docs)
        return instance
