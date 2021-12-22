import sys
from django.apps import AppConfig


class TrailsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'trails'

    def ready(self):
        if 'runserver' not in sys.argv:
            return True

        # you must import your modules here
        # to avoid AppRegistryNotReady exception
        from .models import Game
        from .enums import ClockType
        for game in Game.objects.all():
            if game.clock_state != ClockType.STOPPED:
                game.clock_state = ClockType.STOPPED
                game.save()
