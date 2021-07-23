from .enums import ClockType, ParameterType, ParameterScope, CharacterType
from .qr_models import Code
from django.db import models


class Game(models.Model):
    name = models.CharField(max_length=255, unique=True)
    clock = models.OneToOneField(
        'Clock',
        on_delete=models.CASCADE,
        related_name="game",
        null=True,
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
    class Meta:
        unique_together = ('name', 'game',)
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
    class Meta:
        unique_together = ('bearer', 'game',)
    name = models.CharField(max_length=255)
    bearer = models.CharField(max_length=255)
    game = models.ForeignKey(
        'Game',
        on_delete=models.CASCADE,
        related_name='player'
    )
    character = models.ForeignKey(
        'Character',
        on_delete=models.CASCADE,
    )

    action_points = models.IntegerField(default=0)

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
    game = models.ForeignKey(
        'Game',
        on_delete=models.CASCADE,
        related_name="logs"
    )
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    code = models.ForeignKey(
        Code,
        on_delete=models.CASCADE,
        related_name="logs"
    )

    def __str__(self):
        return "{0} - Game: {1}, Code: {2}".format(str(self.created_at), self.game, self.code)
