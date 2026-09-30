from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Property(models.Model):
    class Status(models.TextChoices):
        SALE = "sale", "For Sale"
        RENT = "rent", "For Rent"

    class PropertyType(models.TextChoices):
        APARTMENT = "apartment", "Apartment"
        VILLA = "villa", "Villa"
        PENTHOUSE = "penthouse", "Penthouse"
        TOWNHOUSE = "townhouse", "Townhouse"
        LAND = "land", "Land"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.SALE)
    property_type = models.CharField(
        max_length=32,
        choices=PropertyType.choices,
        default=PropertyType.APARTMENT,
    )
    price = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=8, default="AED")
    bedrooms = models.PositiveSmallIntegerField(default=0)
    bathrooms = models.PositiveSmallIntegerField(default=0)
    area_sqft = models.PositiveIntegerField(default=0)
    community = models.CharField(max_length=120)
    city = models.CharField(max_length=80, default="Dubai")
    short_description = models.TextField()
    description = models.TextField()
    cover_document = models.ForeignKey(
        "documents.Document",
        related_name="cover_residencies",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="residencies",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]
        verbose_name_plural = "Properties"

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)[:200] or "residence"
            candidate = base
            index = 2
            while Property.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base}-{index}"
                index += 1
            self.slug = candidate
        super().save(*args, **kwargs)

    @property
    def cover_url(self) -> str:
        if self.cover_document_id and self.cover_document:
            return self.cover_document.url
        return ""


class PropertyImage(models.Model):
    listing = models.ForeignKey(
        Property,
        related_name="images",
        on_delete=models.CASCADE,
    )
    document = models.ForeignKey(
        "documents.Document",
        related_name="property_images",
        on_delete=models.CASCADE,
    )
    alt = models.CharField(max_length=200, blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.listing.title} image {self.sort_order}"

    @property
    def url(self) -> str:
        if self.document_id and self.document:
            return self.document.url
        return ""
