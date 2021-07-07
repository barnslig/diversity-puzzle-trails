from .enums import ClockType, ParameterType, ParameterScope, CharacterType
from django.db import models


class Game(models.Model):
    name = models.CharField(max_length=255, unique=True)
    clock = models.OneToOneField(
        'Clock',
        on_delete=models.CASCADE,
        related_name="game"
    )

    def __str__(self):
        return self.name


class Clock(models.Model):
    state = models.CharField(
        max_length=2,
        choices=ClockType.choices,
        default=ClockType.STOPPED,
    )
    # 1000 => Default speed, "real time"
    # 2000 => Half-Speed, "slow time"
    #  500 => Double speed, "fast time"
    # amount of miliseconds resulting in one 'tick'
    speed = models.IntegerField()

    def __str__(self):
        try:
            return "Clock from {0} at state {1}".format(
                self.game, self.state
            )
        except Game.DoesNotExist:
            return "Clock without game at state {0}".format(
                self.state
            )


class Parameter(models.Model):
    name = models.CharField(
        max_length=2,
        choices=ParameterType.choices,
        default=ParameterType.NONE,
    )
    scope = models.CharField(
        max_length=2,
        choices=ParameterScope.choices,
        default=ParameterScope.GLOBAL,
    )

    min_value = 0

    # From the documentation 
    # "Values from -2147483648 to 2147483647 are safe in all databases supported by Django."
    max_value = 2147483647
    value = models.IntegerField()

    # Amount to subtrac during one "tick"
    rate = models.IntegerField()
    game = models.ForeignKey(
        'Game',
        on_delete=models.CASCADE,
        related_name="parameter"
    )

    def scope_label(self):
        return ParameterScope(self.scope).label

    def label(self):
        return ParameterType(self.name).label

    def __str__(self):
        return "Paramter {0} from {1}".format(
            self.label(), self.game
        )


class Player(models.Model):
    name = models.CharField(max_length=255)
    game = models.ForeignKey(
        'Game',
        on_delete=models.CASCADE,
        related_name='player'
    )
    character = models.ForeignKey(
        'Character',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return "Player {0} from game {1}".format(
            self.name, self.game
        )


class Character(models.Model):
    character_class = models.CharField(
        max_length=2,
        choices=CharacterType.choices,
        default=CharacterType.NONE,
        unique=True
    )

    def label(self):
        return CharacterType(self.character_class).label

    def __str__(self):
        return "Character {0}".format(self.label())


class Log(models.Model):
    created_at = None
    game = None
    code = None
