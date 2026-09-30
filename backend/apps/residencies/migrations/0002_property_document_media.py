# Generated manually for document FK media + unlimited descriptions

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("documents", "0001_initial"),
        ("residencies", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="property",
            name="short_description",
            field=models.TextField(),
        ),
        migrations.AddField(
            model_name="property",
            name="cover_document",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="cover_residencies",
                to="documents.document",
            ),
        ),
        migrations.RemoveField(
            model_name="property",
            name="cover_image",
        ),
        migrations.RemoveField(
            model_name="property",
            name="cover_image_url",
        ),
        # Clear gallery rows before requiring document FK
        migrations.RunSQL(
            sql="DELETE FROM residencies_propertyimage;",
            reverse_sql=migrations.RunSQL.noop,
        ),
        migrations.RemoveField(
            model_name="propertyimage",
            name="image",
        ),
        migrations.RemoveField(
            model_name="propertyimage",
            name="image_url",
        ),
        migrations.AddField(
            model_name="propertyimage",
            name="document",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="property_images",
                to="documents.document",
            ),
        ),
    ]
