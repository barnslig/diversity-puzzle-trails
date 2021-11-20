import qrcode
import uuid
from .enums import ParameterType, CharacterType, ActionType
from django.db import models
from django.core.files import File


class Code(models.Model):
    name = models.CharField(
        max_length=255,
        default="",
        blank=True
    )
    one_shot = models.BooleanField(default=False)
    uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    image = models.ImageField(blank=True)

    def __str__(self):
        ret = ""
        if len(self.name) > 0:
            ret += self.name + ": "
        ret += "One-Shot: {0}, ".format(str(self.one_shot))
        ret += str([action.label() for action in self.actions.all()])
        ret += " UUID: "+str(self.uuid)
        return ret

    def save(self, *args, **kwargs):
        img = qrcode.make("http://localhost:8080/code/"+str(self.uuid))
        file_name = "{0}.png".format(str(self.name))
        file_path = "/tmp/{0}".format(file_name)
        img.save(file_path)
        self.image.delete(save=False)
        self.image = File(open(file_path, 'rb'), name=file_name)
        super(Code, self).save(*args, **kwargs)


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
