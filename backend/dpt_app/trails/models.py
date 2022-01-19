from django.contrib import admin
from django.db import models
from django.db.models import F, Min
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
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

    slug = models.SlugField()

    clock_state = models.CharField(
        max_length=255,
        choices=ClockType.choices,
        default=ClockType.STOPPED,
        verbose_name=_("Clock State")
    )

    # 0.5 => Half-Speed, "slow time"
    # 1.0 => Default speed, "real time"
    # 2.0 => Double speed, "fast time"
    clock_speed = models.FloatField(
        default=1,
        verbose_name=_("Clock Speed")
    )

    clock_last_change = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Last clock state change")
    )

    clock_duration = models.IntegerField(
        default=0,
        verbose_name=_("Total clock running duration")
    )

    hasUserParameterScope = models.BooleanField(
        default=False,
        verbose_name=_("Has User Parameter Scope?")
    )

    hasMessages = models.BooleanField(
        default=False,
        verbose_name=_("Has Messages Feature?")
    )

    @property
    @admin.display(description=_("Maximum Game Duration"))
    def max_clock_duration(self):
        """Get the maximum clock duration"""
        return Parameter.max_clock_duration(self)

    @property
    @admin.display(description=_("Total Game Duration"))
    def total_clock_duration(self):
        """Get the current clock duration"""
        clock_duration = self.clock_duration
        if self.clock_state == ClockType.RUNNING:
            clock_duration = self.clock_duration + \
                timezone.now().timestamp() - self.clock_last_change.timestamp()

        return min(self.max_clock_duration, clock_duration)

    @property
    @admin.display(description=_("Is Game Over?"))
    def is_game_over(self):
        """Get whether the game is in game over state"""
        return self.total_clock_duration == self.max_clock_duration

    def resolve_game_over_add_points(self, num_points):
        """Resolve a game over state by adding points to the parameter which is causing the game over"""
        if not self.is_game_over:
            return

        for param in self.parameter.all():
            if param.current_value == 0:
                self.clock_last_change = timezone.now()
                self.save()

                param.value += num_points
                param.save()

                return param

    def resolve_game_over_add_time(self, num_time):
        """Resolve a game over state by adding time to the game"""
        self.clock_state = ClockType.RUNNING
        self.clock_last_change = timezone.now()
        self.clock_duration = max(0, self.clock_duration - num_time)
        self.save()

    def reset(self):
        """Reset a game by resetting the clock and added parameter values"""
        self.clock_state = ClockType.STOPPED
        self.clock_duration = 0
        self.clock_last_change = timezone.now()
        self.save()

        self.parameter.all().update(value=0)

    def __str__(self):
        return self.name


@receiver(pre_save, sender=Game)
def update_clock_last_change(sender, instance: Game, *args, **kwargs):
    # Do nothing when no id is set. This is the case when a new model instance gets created
    if not instance.id:
        return

    clock_current_state = Game.objects.get(id=instance.id).clock_state
    clock_next_state = instance.clock_state

    if clock_current_state != clock_next_state:
        if clock_current_state == ClockType.RUNNING:
            next_clock_duration = instance.clock_duration + \
                timezone.now().timestamp() - instance.clock_last_change.timestamp()

            instance.clock_duration = min(
                instance.max_clock_duration, next_clock_duration)

        instance.clock_last_change = timezone.now()


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

    min_value = models.IntegerField(
        default=0,
        verbose_name=_("Minimum Value")
    )

    # From the documentation
    # "Values from -2147483648 to 2147483647 are safe in all databases supported by Django."
    max_value = models.IntegerField(
        default=2147483647,
        verbose_name=_("Maximum Value")
    )

    initial_value = models.IntegerField(
        verbose_name=_("Initial Value")
    )

    value = models.IntegerField(
        default=0,
        verbose_name=_("Value")
    )

    # Amount to subtrac during one "tick"
    rate = models.FloatField(
        default=0,
        verbose_name=_("Rate")
    )
    game = models.ForeignKey(
        'Game',
        on_delete=models.CASCADE,
        related_name="parameter",
        verbose_name=_("Game")
    )

    @staticmethod
    def max_clock_duration(game: Game):
        """Get the maximum game clock duration at which the first parameter is zero"""
        query = Parameter.objects.filter(game=game).annotate(
            dur_when_zero=-1 * (F('initial_value') + F('value')) / (F('game__clock_speed') * F('rate')))

        return query.aggregate(Min('dur_when_zero'))['dur_when_zero__min']

    def value_at(self, clock_duration):
        """Get the parameter value at a specific game clock duration"""
        value = round((self.initial_value + self.value) + clock_duration
                      * self.game.clock_speed * self.rate)

        return max(min(value, self.max_value), self.min_value)

    @property
    @admin.display(description=_("Current Value"))
    def current_value(self):
        """Get the current parameter value, with respect to the current game clock duration"""
        return self.value_at(self.game.total_clock_duration)

    @property
    @admin.display(description=_("Clock Duration When Zero"))
    def game_clock_duration_when_value_zero(self):
        """Get the game.clock_duration at which this parameter is zero"""
        return -1 * (self.initial_value + self.value) / (self.game.clock_speed * self.rate)

    def label(self):
        return ParameterType(self.name).label

    def __str__(self):
        return _("Parameter {0} from {1}").format(
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
        return _("Player {0} from game {1}").format(
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
        return _("Character {0}").format(self.label())


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
    player = models.ForeignKey(
        'Player',
        on_delete=models.CASCADE,
        related_name="logs",
        verbose_name=_("Player")
    )

    def __str__(self):
        return _("{0} - Game: {1}, Code: {2}").format(
            str(self.created_at), self.game, self.code
        )
