from rest_framework import serializers

from apps.documents.models import Document


class DocumentSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    uploaded_by_username = serializers.CharField(
        source="uploaded_by.username",
        read_only=True,
        default="",
    )

    class Meta:
        model = Document
        fields = (
            "id",
            "original_name",
            "content_type",
            "size",
            "folder",
            "url",
            "uploaded_by",
            "uploaded_by_username",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "original_name",
            "content_type",
            "size",
            "uploaded_by",
            "uploaded_by_username",
            "created_at",
            "updated_at",
        )

    def get_url(self, obj: Document) -> str:
        url = obj.url
        if not url:
            return ""
        request = self.context.get("request")
        if request and url.startswith("/"):
            return request.build_absolute_uri(url)
        return url


class DocumentUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    folder = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=64,
        default="general",
    )

    def validate_folder(self, value: str) -> str:
        cleaned = (value or "general").strip().strip("/")
        if not cleaned:
            return "general"
        if ".." in cleaned or cleaned.startswith("/"):
            raise serializers.ValidationError("Invalid folder name.")
        return cleaned[:64]

    def create(self, validated_data):
        upload = validated_data["file"]
        request = self.context["request"]
        return Document.objects.create(
            file=upload,
            original_name=getattr(upload, "name", "") or "upload",
            content_type=getattr(upload, "content_type", "") or "",
            size=getattr(upload, "size", 0) or 0,
            folder=validated_data.get("folder") or "general",
            uploaded_by=request.user if request.user.is_authenticated else None,
        )
