from django.core.files import File
from django.db import models
from django.utils.translation import gettext_lazy as _, pgettext_lazy
import qrcode
import uuid

from .enums import ParameterType, CharacterType, ActionType


class Code(models.Model):
    class Meta:
        verbose_name = _('Code')
        verbose_name_plural = _('Codes')

    name = models.CharField(
        max_length=255,
        default="",
        blank=True,
        verbose_name=pgettext_lazy("Code Name", "Name")
    )
    one_shot = models.BooleanField(
        default=False,
        verbose_name=_("One-Shot")
    )
    uuid = models.CharField(
        max_length=255,
        default=uuid.uuid4,
        unique=True,
        verbose_name=_("UUID")
    )
    image = models.ImageField(
        blank=True,
        verbose_name=_("Image")
    )

    def __str__(self):
        ret = ""
        if len(self.name) > 0:
            ret += self.name + ": " + str(self.uuid)
        else:
            ret = str(self.uuid)
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
    class Meta:
        verbose_name = _('Action')
        verbose_name_plural = _('Actions')

    code = models.ForeignKey(
        'Code',
        on_delete=models.CASCADE,
        related_name="actions",
        verbose_name=_("Code")
    )
    action_type = models.CharField(
        max_length=255,
        choices=ActionType.choices,
        default=ActionType.NONE,
        verbose_name=_("Action Type")
    )
    parameter = models.CharField(
        max_length=255,
        choices=ParameterType.choices,
        default=ParameterType.NONE,
        verbose_name=_("Parameter")
    )
    value = models.IntegerField(
        default=0,
        verbose_name=_("Value")
    )
    character = models.CharField(
        max_length=255,
        choices=CharacterType.choices,
        default=CharacterType.NONE,
        verbose_name=_("Character")
    )

    def label(self):
        return ActionType(self.action_type).label

    def __str__(self):
        return _("Action: {0}").format(self.label())
