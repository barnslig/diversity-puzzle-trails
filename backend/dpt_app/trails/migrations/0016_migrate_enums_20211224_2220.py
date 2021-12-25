# Generated by Django 3.2.9 on 2021-12-24 22:20

from django.db import migrations, models

from ..enums import ActionType, CharacterType, ClockType, ParameterType, ParameterScope

enumMap = {
    "ClockType": {
        "ST": ClockType.STOPPED,
        "RN": ClockType.RUNNING,
    },
    "CharacterType": {
        "NE": CharacterType.NONE,
        "ER": CharacterType.ENGINEER,
        "PT": CharacterType.PILOT,
    },
    "ParameterType": {
        "NE": ParameterType.NONE,
        "EN": ParameterType.ENERGY,
        "FD": ParameterType.FOOD,
        "HY": ParameterType.HYGIENE,
        "ML": ParameterType.MORAL,
    },
    "ParameterScope": {
        "NE": ParameterScope.NONE,
        "GL": ParameterScope.GLOBAL,
        "FD": ParameterScope.USER,
    },
    "ActionType": {
        "NE": ActionType.NONE,
        "PA": ActionType.PARAMETER,
        "CA": ActionType.CHARACTER,
    }
}


def migrate_enum(model, field, enum):
    for key, value in enumMap[enum].items():
        filterObj = {}
        filterObj[field] = key

        updateObj = {}
        updateObj[field] = value

        model.objects.filter(**filterObj).update(**updateObj)


def migrate_enums(apps, schema_editor):
    Action = apps.get_model("trails", "Action")
    migrate_enum(Action, "action_type", "ActionType")
    migrate_enum(Action, "character", "CharacterType")
    migrate_enum(Action, "parameter", "ParameterType")

    Character = apps.get_model("trails", "Character")
    migrate_enum(Character, "character_class", "CharacterType")

    Game = apps.get_model("trails", "Game")
    migrate_enum(Game, "clock_state", "ClockType")

    Parameter = apps.get_model("trails", "Parameter")
    migrate_enum(Parameter, "name", "ParameterType")
    migrate_enum(Parameter, "scope", "ParameterScope")


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0015_auto_20211224_2214'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='action_type',
            field=models.CharField(choices=[('none', 'None'), ('parameter', 'Parameter'), (
                'character', 'Character')], default='none', max_length=255, verbose_name='Action Type'),
        ),
        migrations.AlterField(
            model_name='action',
            name='character',
            field=models.CharField(choices=[('none', 'None'), ('engineer', 'Engineer'), (
                'pilot', 'Pilot')], default='none', max_length=255, verbose_name='Character'),
        ),
        migrations.AlterField(
            model_name='action',
            name='parameter',
            field=models.CharField(choices=[('none', 'None'), ('energy', 'Energy'), ('food', 'Food'), (
                'hygiene', 'Hygiene'), ('moral', 'Moral')], default='none', max_length=255, verbose_name='Parameter'),
        ),
        migrations.AlterField(
            model_name='character',
            name='character_class',
            field=models.CharField(choices=[('none', 'None'), ('engineer', 'Engineer'), (
                'pilot', 'Pilot')], default='none', max_length=255, unique=True, verbose_name='Character Class'),
        ),
        migrations.AlterField(
            model_name='game',
            name='clock_state',
            field=models.CharField(choices=[('stopped', 'Stopped'), (
                'running', 'Running')], default='stopped', max_length=255, verbose_name='Clock State'),
        ),
        migrations.AlterField(
            model_name='parameter',
            name='name',
            field=models.CharField(choices=[('none', 'None'), ('energy', 'Energy'), ('food', 'Food'), (
                'hygiene', 'Hygiene'), ('moral', 'Moral')], default='none', max_length=255, verbose_name='Name'),
        ),
        migrations.AlterField(
            model_name='parameter',
            name='scope',
            field=models.CharField(choices=[('none', 'None'), ('global', 'Global'), (
                'user', 'User')], default='global', max_length=255, verbose_name='Scope'),
        ),
        migrations.RunPython(migrate_enums),
    ]
