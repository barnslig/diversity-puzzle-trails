from django import forms
from django.contrib import admin, messages
from django.contrib.auth.models import User, Group
from django.http import HttpResponse
from django.http.response import HttpResponseRedirect
from django.utils.translation import gettext as _

from .models import Game, Message, Parameter, Player, Character, Log
from .qr_models import Code, Action

admin.site.site_header = _("Diversity Puzzle Trails Administration")
admin.site.site_title = _("DPT admin")

# Register your models here.


class ActionInline(admin.StackedInline):
    model = Action
    extra = 0


class LogInline(admin.TabularInline):
    model = Log
    extra = 0


class ParameterInline(admin.TabularInline):
    model = Parameter
    extra = 0
    exclude = ('fixup_value', 'min_value', 'max_value',)
    readonly_fields = ('current_value',)


class MessageInline(admin.TabularInline):
    model = Message
    extra = 1
    readonly_fields = ('created_at',)


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
        MessageInline,
        PlayerInline,
        LogInline
    ]

    prepopulated_fields = {'slug': ('name',)}

    # form = GameForm
    add_form = GameForm

    exclude = ('clock_last_change', 'clock_duration',)

    save_on_top = True

    change_form_template = "game_change_form.html"

    def get_readonly_fields(self, request, obj=None):
        if obj:
            # Only show readonly fields on the edit page of an existing object
            return (
                'total_clock_duration',
                'max_clock_duration',
                'is_game_over',
            )

        return super().get_readonly_fields(request, obj)

    def response_change(self, request: HttpResponse, obj: Game):
        if "_add-points" in request.POST:
            num_points = 10
            param = obj.resolve_game_over_add_points(num_points)

            if param:
                self.message_user(request, _(
                    f"Added {num_points} points to the lowest parameter {param.name}"))
            else:
                self.message_user(request, _(
                    "Not in game over state!"), level=messages.WARNING)

            return HttpResponseRedirect(".")

        if "_add-minutes" in request.POST:
            num_minutes = 15
            obj.resolve_game_over_add_time(num_minutes * 60)

            self.message_user(request, _(
                f"Added {num_minutes} minutes to the game"))
            return HttpResponseRedirect(".")

        if "_reset-game" in request.POST:
            obj.reset()

            self.message_user(request, _("Game is resetted"))
            return HttpResponseRedirect(".")

        return super().response_change(request, obj)

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
    readonly_fields = ('image',)
    change_form_template = "code_change_form.html"


admin.site.register(Game, GameAdmin)
admin.site.register(Code, CodeAdmin)
admin.site.register(Character)

admin.site.unregister(Group)
admin.site.unregister(User)
