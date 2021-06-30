from django.contrib import admin
from django.contrib.auth.models import User, Group
from .models import Game, Clock, Parameter, Player, Character
# Register your models here.

admin.site.register(Game)
admin.site.register(Clock)
admin.site.register(Parameter)
admin.site.register(Player)
admin.site.register(Character)
admin.site.unregister(User)
admin.site.unregister(Group)
