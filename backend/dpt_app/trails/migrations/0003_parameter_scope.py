# Generated by Django 3.2.5 on 2021-07-07 20:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0002_auto_20210707_1748'),
    ]

    operations = [
        migrations.AddField(
            model_name='parameter',
            name='scope',
            field=models.CharField(choices=[('NE', 'None'), ('GL', 'global'), ('FD', 'user')], default='GL', max_length=2),
        ),
    ]
