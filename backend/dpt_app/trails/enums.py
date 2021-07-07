from django.db.models import TextChoices


class ClockType(TextChoices):
    STOPPED = 'ST', ('Stopped')
    RUNNING = 'RN', ('Running')


class CharacterType(TextChoices):
    NONE = 'NE', ('None')
    ENGINEER = 'ER', ('Engineer')
    PILOT = 'PT', ('Pilot')


class ParameterType(TextChoices):
    NONE = 'NE', ('none')
    ENERGY = 'EN', ('energy')
    FOOD = 'FD', ('food')
    HYGIENE = 'HY', ('hygiene')
    MORAL = 'ML', ('moral')


class ParameterScope(TextChoices):
    NONE = 'NE', ('None')
    GLOBAL = 'GL', ('global')
    USER = 'FD', ('user')


class ActionType(TextChoices):
    NONE = 'NE', ('None')
    PARAMETER = 'PA', ('Parameter')
    CHARACTER = 'CA', ('Character')
