from django.db import models
from django.utils.translation import gettext_lazy as _, pgettext_lazy

from .enums import ClockType, ParameterType, ParameterScope, CharacterType
from .qr_models import Code


class Game(models.Model):
    class Meta:
        verbose_name = _('Game')
        verbose_name_plural = _('Games')

    name = models.CharField(
        max_length=255,
        unique=True,
        verbose_name=pgettext_lazy("Game Name", "Name")
    )

    clock_state = models.CharField(
        max_length=255,
        choices=ClockType.choices,
        default=ClockType.STOPPED,
        verbose_name=_("Clock State")
    )

    # 1000 => Default speed, "real time"
    # 2000 => Half-Speed, "slow time"
    #  500 => Double speed, "fast time"
    # amount of miliseconds resulting in one 'tick'
    clock_speed = models.IntegerField(
        default=1000,
        verbose_name=_("Clock Speed")
    )

    def __str__(self):
        return self.name


class Parameter(models.Model):
    class Meta:
        verbose_name = _('Parameter')
        verbose_name_plural = _('Parameter')
        unique_together = ('name', 'game',)

    name = models.CharField(
        max_length=255,
        choices=ParameterType.choices,
        default=ParameterType.NONE,
        verbose_name=pgettext_lazy("Parameter Name", "Name")
    )
    scope = models.CharField(
        max_length=255,
        choices=ParameterScope.choices,
        default=ParameterScope.GLOBAL,
        verbose_name=_("Scope")
    )

    min_value = 0

    # From the documentation
    # "Values from -2147483648 to 2147483647 are safe in all databases supported by Django."
    max_value = 2147483647
    value = models.IntegerField(
        verbose_name=_("Value")
    )

    # Amount to subtrac during one "tick"
    rate = models.IntegerField(
        verbose_name=_("Rate")
    )
    game = models.ForeignKey(
        'Game',
        on_delete=models.CASCADE,
        related_name="parameter",
        verbose_name=_("Game")
    )

    def label(self):
        return ParameterType(self.name).label

    def __str__(self):
        return "Paramter {0} from {1}".format(
            self.label(), self.game
        )


class Player(models.Model):
    class Meta:
        verbose_name = _('Player')
        verbose_name_plural = _('Players')
        unique_together = ('bearer', 'game',)

    name = models.CharField(
        max_length=255,
        verbose_name=pgettext_lazy("Player Name", "Name")
    )
    bearer = models.CharField(
        max_length=255,
        verbose_name=_("Bearer")
    )
    game = models.ForeignKey(
        'Game',
        on_delete=models.CASCADE,
        related_name='player',
        verbose_name=_("Game")
    )
    character = models.ForeignKey(
        'Character',
        on_delete=models.CASCADE,
        verbose_name=_("Character")
    )
    action_points = models.IntegerField(
        default=0,
        verbose_name=_("Action Points")
    )

    def __str__(self):
        return "Player {0} from game {1}".format(
            self.name, self.game
        )


class Character(models.Model):
    class Meta:
        verbose_name = _('Character')
        verbose_name_plural = _('Characters')

    character_class = models.CharField(
        max_length=255,
        choices=CharacterType.choices,
        default=CharacterType.NONE,
        unique=True,
        verbose_name=_("Character Class")
    )

    def label(self):
        return CharacterType(self.character_class).label

    def __str__(self):
        return "Character {0}".format(self.label())


class Log(models.Model):
    class Meta:
        verbose_name = _('Log')
        verbose_name_plural = _('Logs')

    game = models.ForeignKey(
        'Game',
        on_delete=models.CASCADE,
        related_name="logs",
        verbose_name=_("Game")
    )
    created_at = models.DateTimeField(
        auto_now=False,
        auto_now_add=True,
        verbose_name=_("Created At")
    )
    code = models.ForeignKey(
        Code,
        on_delete=models.CASCADE,
        related_name="logs",
        verbose_name=_("Code")
    )

    def __str__(self):
        return "{0} - Game: {1}, Code: {2}".format(str(self.created_at), self.game, self.code)
