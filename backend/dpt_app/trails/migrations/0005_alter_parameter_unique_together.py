# Generated by Django 3.2.5 on 2021-07-20 07:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0004_auto_20210719_0854'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='parameter',
            unique_together={('name', 'game')},
        ),
    ]
