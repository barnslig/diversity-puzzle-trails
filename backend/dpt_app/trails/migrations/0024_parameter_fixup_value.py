# Generated by Django 4.0.2 on 2022-02-09 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0023_alter_player_character'),
    ]

    operations = [
        migrations.AddField(
            model_name='parameter',
            name='fixup_value',
            field=models.IntegerField(default=0, verbose_name='Fixup Value'),
        ),
    ]