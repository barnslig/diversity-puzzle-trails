# Generated by Django 3.2.9 on 2021-11-16 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0012_create_superuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='image',
            field=models.ImageField(blank=True, upload_to=''),
        ),
    ]