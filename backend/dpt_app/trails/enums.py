from django.db.models import TextChoices


class ClockType(TextChoices):
    STOPPED = 'ST', ('Stopped')
    RUNNING = 'RN', ('Running')


class CharacterType(TextChoices):
    NONE = 'NE', ('None')
    ENGINEER = 'ER', ('Engineer')
    PILOT = 'PT', ('Pilot')


class ParameterType(TextChoices):
    NONE = 'NE', ('None')
    ENERGY = 'EN', ('Energy')
    FOOD = 'FD', ('Food')


class ActionType(TextChoices):
    NONE = 'NE', ('None')
    PARAMETER = 'PA', ('Parameter')
    CHARACTER = 'CA', ('Character')
