from django import forms
from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.utils.translation import gettext as _

from .models import Game, Parameter, Player, Character, Log
from .qr_models import Code, Action

admin.site.site_header = _("Diversity Puzzle Trails Administration")
admin.site.site_title = _("DPT admin")

# Register your models here.


class ActionInline(admin.TabularInline):
    model = Action
    extra = 0


class LogInline(admin.TabularInline):
    model = Log
    extra = 0


class ParameterInline(admin.TabularInline):
    model = Parameter
    extra = 0


class PlayerInline(admin.TabularInline):
    model = Player
    extra = 0


class GameForm(forms.ModelForm):
    template_game = forms.ModelChoiceField(
        queryset=Game.objects.all(), required=False)
    # ToDo: validate


class GameAdmin(admin.ModelAdmin):
    inlines = [
        ParameterInline,
        PlayerInline,
        LogInline
    ]

    prepopulated_fields = {'slug': ('name',)}

    # form = GameForm
    add_form = GameForm

    def get_form(self, request, obj=None, **kwargs):
        """
        Use special form during foo creation
        """
        defaults = {}
        if obj is None:
            defaults['form'] = self.add_form
        defaults.update(kwargs)
        return super().get_form(request, obj, **defaults)

    def save_model(self, request, obj, form, change):
        if 'template_game' in form.data.keys() and form.data['template_game']:
            template_game = Game.objects.get(pk=form.data['template_game'])

        super().save_model(request, obj, form, change)

        if 'template_game' in form.data.keys() and form.data['template_game']:
            for parameter in Parameter.objects.filter(game=template_game):
                parameter.pk = None
                parameter._state.adding = True
                parameter.game = obj
                parameter.save()


class CodeAdmin(admin.ModelAdmin):
    inlines = [
        ActionInline
    ]
    readonly_fields = ('image', 'uuid')


admin.site.register(Game, GameAdmin)
admin.site.register(Code, CodeAdmin)
admin.site.register(Character)

admin.site.unregister(Group)
admin.site.unregister(User)
