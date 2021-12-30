# Generated by Django 3.2.5 on 2021-07-24 13:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0012_log_player'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='hasMessages',
            field=models.BooleanField(default=False, verbose_name='Has Messages Feature?'),
        ),
        migrations.AddField(
            model_name='game',
            name='hasUserParameterScope',
            field=models.BooleanField(default=False, verbose_name='Has User Parameter Scope?'),
        ),
    ]