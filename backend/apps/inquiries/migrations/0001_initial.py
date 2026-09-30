import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("residencies", "0002_property_document_media"),
    ]

    operations = [
        migrations.CreateModel(
            name="Inquiry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=120)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(blank=True, max_length=40)),
                ("message", models.TextField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("new", "New"),
                            ("contacted", "Contacted"),
                            ("in_progress", "In progress"),
                            ("closed", "Closed"),
                            ("archived", "Archived"),
                        ],
                        db_index=True,
                        default="new",
                        max_length=20,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "listing",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        # Temporary related_name while residencies.Inquiry still exists.
                        related_name="inquiries_relocating",
                        to="residencies.property",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Inquiries",
                "ordering": ["-created_at"],
            },
        ),
    ]
