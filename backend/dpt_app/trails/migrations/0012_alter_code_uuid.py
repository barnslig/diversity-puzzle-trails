# Generated by Django 3.2.5 on 2021-07-25 08:25

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0011_auto_20210723_1151'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='uuid',
            field=models.CharField(default=uuid.uuid4, max_length=255, unique=True),
        ),
    ]