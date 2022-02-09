# Generated by Django 4.0.2 on 2022-02-09 18:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0024_parameter_fixup_value'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='character',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='trails.character', verbose_name='Character'),
        ),
    ]
