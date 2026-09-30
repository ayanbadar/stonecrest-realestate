from django.db import connection, migrations


def copy_residencies_inquiries(apps, schema_editor):
    OldInquiry = apps.get_model("residencies", "Inquiry")
    NewInquiry = apps.get_model("inquiries", "Inquiry")

    rows = []
    for inquiry in OldInquiry.objects.all().iterator():
        rows.append(
            NewInquiry(
                id=inquiry.id,
                name=inquiry.name,
                email=inquiry.email,
                phone=inquiry.phone,
                message=inquiry.message,
                status="new",
                listing_id=inquiry.listing_id,
                created_at=inquiry.created_at,
                updated_at=inquiry.created_at,
            )
        )
    if not rows:
        return

    NewInquiry.objects.bulk_create(rows)

    if connection.vendor == "postgresql":
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT setval(
                    pg_get_serial_sequence('inquiries_inquiry', 'id'),
                    COALESCE((SELECT MAX(id) FROM inquiries_inquiry), 1)
                )
                """
            )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("inquiries", "0001_initial"),
        ("residencies", "0002_property_document_media"),
    ]

    operations = [
        migrations.RunPython(copy_residencies_inquiries, noop_reverse),
    ]
