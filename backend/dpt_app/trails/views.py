import time
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Game, Log, Parameter
from .qr_models import Code
from .enums import ClockType, ParameterType, ActionType, CharacterType

# TODO: For production, protect this variable with a mutex
# or move it into the DB
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


def getGameOr404(request, gameId, get, post):
    try: 
        game = Game.objects.get(name=gameId)
    except Game.DoesNotExist:
        return JsonResponse({"Errors": [
            {
                "id": "not-found",
                "status": 404,
                "title": "Unknown Game ID"
            }
        ]}, status=404)

    calcTimepassingParameters(game)

    if request.method == 'GET':
        return get(game)
    elif request.method == 'POST':
        return post(game)


def index(request):
    return HttpResponse("Hello, world.")


def clock(request, gameId):
    return getGameOr404(request, gameId, func_clock_get, func_clock_post)


def func_clock_get(game):
    clock_data = {
        "type": "clock",
        "id": game.clock.id,
        "attributes": {
            "state": ClockType(game.clock.state).label,
            "speed": game.clock.speed
        }
    }

    return buildJsonResponse(clock_data)


def func_clock_post(game):
    return buildJsonResponse({"Not implemented"})


@csrf_exempt
def code(request, gameId, codeId):
    try: 
        game = Game.objects.get(name=gameId)
    except Game.DoesNotExist:
        return JsonResponse({"Errors": [
            {
                "id": "not-found",
                "status": 404,
                "title": "Unknown Game ID"
            }
        ]}, status=404)

    calcTimepassingParameters(game)

    try:
        code = Code.objects.get(pk=codeId)
    except Code.DoesNotExist:
        return JsonResponse({"Errors": [
            {
                "id": "not-found",
                "status": 404,
                "title": "Unknown QR code ID"
            }
        ]}, status=404)

    if request.method == 'GET':
        return func_code_get(game, code)
    elif request.method == 'POST':
        return func_code_post(game, code)


def func_code_get(game, code):
    response = {
        "type": "code",
        "id": code.id,
        "attributes": {
            "oneShot": code.one_shot,
            "actions": []
        }
    }

    for action in code.actions.all():
        if action.action_type == ActionType.PARAMETER:
            response["attributes"]["actions"].append(
                {
                    "type": "changeParameter",
                    "parameter": ParameterType(action.parameter).label,
                    "add": action.value
                }
            )
        elif action.action_type == ActionType.CHARACTER:
            response["attributes"]["actions"].append(
                {
                    "type": "setCharacter",
                    "character": CharacterType(action.character).label,
                }
            )
        else:
            pass

    return buildJsonResponse(response)


def func_code_post(game, code):
    if code.one_shot is True and game.logs.filter(id=code.id).exists():
        return JsonResponse({"errors": [
            {
              "id": "already-used",
              "status": 403,
              "title": "This QR code is already used"
            }
          ]}, status=403)

    for action in code.actions.all():
        if action.action_type == ActionType.PARAMETER:
            try:
                parameter = Parameter.objects.get(name=action.parameter, game=game)
                parameter.value += action.value
                parameter.save()
            except:
                pass
        elif action.action_type == ActionType.CHARACTER:
            pass
        else:
            pass

    Log(game=game, code=code).save()
    # Apply code here
    return func_code_get(game, code)


def parameter(request, gameId):
    return getGameOr404(request, gameId, func_parameter_get, func_parameter_post)


def func_parameter_get(game):
    response = []
    for parameter in game.parameter.all():
        response.append(
            {
                "type": "parameter",
                "id": parameter.label(),
                "attributes": {
                    "scope": parameter.scope_label(),
                    "value": parameter.value,
                    "rate": parameter.rate,
                    "min": parameter.min_value,
                    "max": parameter.max_value 
                }
            }
        )

    return buildJsonResponse(response)


def func_parameter_post(game):
    return buildJsonResponse({"Not implemented"})
