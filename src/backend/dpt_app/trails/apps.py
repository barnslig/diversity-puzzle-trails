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
        from .models import Clock
        from .enums import ClockType
        for clk in Clock.objects.all():
            if clk.state != ClockType.STOPPED:
                clk.state = ClockType.STOPPED
                clk.save()
