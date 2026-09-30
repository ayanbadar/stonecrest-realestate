# Generated manually — restore related_name after residencies.Inquiry is removed.

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("inquiries", "0002_copy_from_residencies"),
        ("residencies", "0003_delete_inquiry"),
    ]

    operations = [
        migrations.AlterField(
            model_name="inquiry",
            name="listing",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="inquiries",
                to="residencies.property",
            ),
        ),
    ]
