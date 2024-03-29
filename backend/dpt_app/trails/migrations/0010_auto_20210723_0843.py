# Generated by Django 3.2.5 on 2021-07-23 08:43

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0009_code_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='code',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AlterField(
            model_name='code',
            name='image',
            field=models.ImageField(blank=True, editable=False, upload_to='media/'),
        ),
    ]
