from django import forms
from django.contrib import admin
from django.contrib.auth.models import User, Group
from .models import Game, Parameter, Player, Character, Log
from .qr_models import Code, Action
# Register your models here.


class GameForm(forms.ModelForm):
    template_game = forms.ModelChoiceField(
        queryset=Game.objects.all(), required=False)
    # ToDo: validate


class GameAdmin(admin.ModelAdmin):
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


class ParameterAdmin(admin.ModelAdmin):
    list_display = ('game', 'name', 'value')


admin.site.register(Game, GameAdmin)
admin.site.register(Parameter, ParameterAdmin)
admin.site.register(Player)
admin.site.register(Character)
admin.site.register(Log)


class CodeAdmin(admin.ModelAdmin):
    readonly_fields = ('image', 'uuid')


admin.site.register(Code, CodeAdmin)
admin.site.register(Action)

admin.site.unregister(User)
admin.site.unregister(Group)
