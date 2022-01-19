from django.db.models import IntegerChoices, TextChoices
from django.utils.translation import gettext_lazy as _


class ClockType(TextChoices):
    STOPPED = 'stopped', _('Stopped')
    RUNNING = 'running', _('Running')


class ClockUnit(IntegerChoices):
    SECONDS = 1, _('Seconds')
    MINUTES = 60, _('Minutes')


class CharacterType(TextChoices):
    NONE = 'none', _('None')
    ENGINEER = 'engineer', _('Engineer')
    PILOT = 'pilot', _('Pilot')


class ParameterType(TextChoices):
    NONE = 'none', _('None')
    ENERGY = 'energy', _('Energy')
    FOOD = 'food', _('Food')
    HYGIENE = 'hygiene', _('Hygiene')
    MORAL = 'moral', _('Moral')


class ParameterScope(TextChoices):
    NONE = 'none', _('None')
    GLOBAL = 'global', _('Global')
    USER = 'user', _('User')


class ActionType(TextChoices):
    NONE = 'none', _('None')
    PARAMETER = 'parameter', _('Parameter')
    CHARACTER = 'character', _('Character')
