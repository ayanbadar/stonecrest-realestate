from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("residencies", "0002_property_document_media"),
        ("inquiries", "0002_copy_from_residencies"),
    ]

    operations = [
        migrations.DeleteModel(name="Inquiry"),
    ]
