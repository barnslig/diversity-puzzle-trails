import time
from django.http import HttpResponse, JsonResponse
from .models import Game
from .enums import ClockType

last_time = time.time()


def calcTimepassingParameters(game):
    global last_time
    if game.clock.state == ClockType.RUNNING:
        current_time = time.time()
        passed_time_ms = (current_time - last_time) * 1000
        if passed_time_ms < 500:
            return
        passed_tick = passed_time_ms / game.clock.speed
        last_time = current_time

        for parameter in game.parameter.all():
            parameter.value -= round(passed_tick * parameter.rate)
            parameter.save()

    else:
        # Clock is not runnig, take no action
        pass


def buildJsonResponse(data):
    return JsonResponse(
        {
            "data": data
        }, json_dumps_params={'indent': 4})


def index(request):
    return HttpResponse("Hello, world.")


def clock(request, gameId):
    try: 
        game = Game.objects.get(name=gameId)
    except Game.DoesNotExist:
        return JsonResponse({"Erros": ["Object does not exist"]}, status=404)

    clock_data = {
                "type": "clock",
                "id": game.clock.id,
                "attributes": {
                    "state": ClockType(game.clock.state).label,
                    "speed": game.clock.speed
                }
            }

    calcTimepassingParameters(game)
    return buildJsonResponse(clock_data)


def parameter(request, gameId):
    try: 
        game = Game.objects.get(name=gameId)
    except Game.DoesNotExist:
        return JsonResponse({"Erros": ["Object does not exist"]}, status=404)

    calcTimepassingParameters(game)

    response = []
    for parameter in game.parameter.all():
        response.append(
            {
                "type": "parameter",
                "id": parameter.label(),
                "attributes": {
                    "scope": "Not implemented",
                    "value": parameter.value,
                    "rate": parameter.rate,
                    "min": parameter.min_value,
                    "max": parameter.max_value 
                }
            }
        )

    return buildJsonResponse(response)
