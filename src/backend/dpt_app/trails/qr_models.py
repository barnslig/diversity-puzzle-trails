from .enums import ParameterType, CharacterType, ActionType
from django.db import models


class Code(models.Model):
    name = models.CharField(
        max_length=255,
        default="",
        blank=True
    )
    one_shot = models.BooleanField(default=False)

    def __str__(self):
        ret = ""
        if len(self.name) > 0:
            ret += self.name + ": "
        ret += "One-Shot: {0}, ".format(str(self.one_shot))
        ret += str([action.label() for action in self.actions.all()])
        return ret


class Action(models.Model):
    code = models.ForeignKey(
        'Code',
        on_delete=models.CASCADE,
        related_name="actions"
    )
    action_type = models.CharField(
        max_length=2,
        choices=ActionType.choices,
        default=ActionType.NONE,
    )
    parameter = models.CharField(
        max_length=2,
        choices=ParameterType.choices,
        default=ParameterType.NONE,
    )
    value = models.IntegerField(default=0)
    character = models.CharField(
        max_length=2,
        choices=CharacterType.choices,
        default=CharacterType.NONE,
    )

    def label(self):
        return ActionType(self.action_type).label

    def __str__(self):
        return "Action: {0}".format(self.label())
