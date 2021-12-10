import time
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Game, Log, Parameter, Player, Character
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

        for player in game.player.all():
            player.action_points += round(passed_tick * 1)
            if player.action_points > 15:
                player.action_points = 15
            player.save()

    else:
        # Clock is not runnig, take no action
        pass


def buildJsonResponse(data):
    return JsonResponse(
        {
            "data": data
        }, json_dumps_params={'indent': 4})


def get_game_or_404(func):
    def inner(request, gameId, *args, **kwargs):
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
        return func(request, game, *args, **kwargs)
    return inner


def has_bearer_or_403(func):
    def inner(request, game, *args, **kwargs):
        if "Authorization" in request.headers.keys():
            bearer = request.headers['Authorization']
            print(bearer)
            if game.player.filter(bearer=bearer).exists():
                return func(request, game, *args, **kwargs)
        return JsonResponse({"Errors": [
            {
                "id": "not-authorised",
                "status": 403,
                "title": "Missing or malformed bearer"
            }
        ]}, status=403)
    return inner


@has_bearer_or_403
def index(request):
    return HttpResponse("Hello, world.")


@get_game_or_404
@has_bearer_or_403
def clock(request, game):
    if request.method == 'GET':
        return func_clock_get(game)
    elif request.method == 'POST':
        return func_clock_post(game)


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
@get_game_or_404
def code(request, game, codeId):
    def is_onboarding(code):
        return code.actions.filter(action_type=ActionType.CHARACTER).exists()
    
    def get_bearer(request):
        if "Authorization" in request.headers.keys():
            return request.headers['Authorization']
        else:
            return None

    def has_valid_bearer(bearer, game):
        return game.player.filter(bearer=bearer).exists()

    calcTimepassingParameters(game)

    try:
        code = Code.objects.get(uuid=codeId)
    except Code.DoesNotExist:
        return JsonResponse({"Errors": [
            {
                "id": "not-found",
                "status": 404,
                "title": "Unknown QR code ID"
            }
        ]}, status=404)

    bearer = get_bearer(request)

    if request.method == 'GET':
        if has_valid_bearer(bearer, game) or is_onboarding(code):
            return func_code_get(game, code)
    elif request.method == 'POST':
        if has_valid_bearer(bearer, game) or is_onboarding(code):
            return func_code_post(game, code, bearer)
    return JsonResponse({"Errors": [
            {
                "id": "not-authorised",
                "status": 403,
                "title": "Missing or malformed bearer"
            }
        ]}, status=403)


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


def func_code_post(game, code, bearer):
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
            if game.player.filter(bearer=bearer).exists():
                """ Error """
                pass
            else:
                Player(
                    name="Example Name",
                    bearer=bearer,
                    game=game,
                    character=Character.objects.get(character_class=action.character)
                ).save()
        else:
            pass

    Log(game=game, code=code).save()
    return func_code_get(game, code)


@get_game_or_404
@has_bearer_or_403
def parameter(request, game):
    def get_bearer(request):
        return request.headers['Authorization']

    calcTimepassingParameters(game)
    if request.method == 'GET':
        bearer = get_bearer(request)
        player = game.player.get(bearer=bearer)
        return func_parameter_get(game, player)
    elif request.method == 'POST':
        return func_parameter_post(game)


def func_parameter_get(game, player):
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

    response.append(
        {
            "type": "parameter",
            "id": "movements",
            "attributes": {
                "scope": "user",
                "value": player.action_points,
                "rate": 1,
                "min": 0,
                "max": 15
            }
        }
    )

    return buildJsonResponse(response)


def func_parameter_post(game):
    return buildJsonResponse({"Not implemented"})