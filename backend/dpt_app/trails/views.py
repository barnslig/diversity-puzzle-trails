from django.http import HttpResponse, JsonResponse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt

from .enums import ClockType, ActionType
from .models import Game, Log, Message, Parameter, Player, Character
from .qr_models import Code


def buildJsonResponse(data):
    return JsonResponse(
        {
            "data": data
        }, json_dumps_params={'indent': 4})


def get_game_or_404(func):
    def inner(request, gameId, *args, **kwargs):
        try:
            game = Game.objects.get(slug=gameId)
        except Game.DoesNotExist:
            return JsonResponse({"errors": [
                {
                    "id": "game-not-found",
                    "status": 404,
                    "title": _("Unknown Game ID")
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
        return JsonResponse({"errors": [
            {
                "id": "not-authorised",
                "status": 403,
                "title": _("Missing or malformed bearer")
            }
        ]}, status=403)
    return inner


@has_bearer_or_403
def index(request):
    return HttpResponse("Hello, world.")


@get_game_or_404
def gameManifest(request, game):
    game_data = {
        "type": "game",
        "id": game.slug,
        "attributes": {
          "hasMessages": game.hasMessages,
          "hasUserParameterScope": game.hasUserParameterScope
        }
    }
    return buildJsonResponse(game_data)


@csrf_exempt
@get_game_or_404
@has_bearer_or_403
def clock(request, game):
    if request.method == 'GET':
        return func_clock_get(game)
    elif request.method == 'POST':
        return func_clock_post(request, game)


def func_clock_get(game):
    clock_data = {
        "type": "clock",
        "id": game.id,
        "attributes": {
            "state": game.clock_state,
            "speed": game.clock_speed
        }
    }

    return buildJsonResponse(clock_data)


def func_clock_post(request, game):
    import pdb; pdb.set_trace()
    data = request.POST['data']
    if data['type'] == 'clock' and data['attributes']['state'] == 'paused':
        game.clock.state = ClockType.STOPPED
    if data['type'] == 'clock' and data['attributes']['state'] == 'running':
        game.clock.state = ClockType.RUNNING

    return func_clock_get(game)


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

    try:
        code = Code.objects.get(uuid=codeId)
    except Code.DoesNotExist:
        return JsonResponse({"errors": [
            {
                "id": "code-not-found",
                "status": 404,
                "title": _("Unknown QR code ID")
            }
        ]}, status=404)

    bearer = get_bearer(request)

    if request.method == 'GET':
        if has_valid_bearer(bearer, game) or is_onboarding(code):
            return func_code_get(game, code)
    elif request.method == 'POST':
        if has_valid_bearer(bearer, game) or is_onboarding(code):
            return func_code_post(game, code, bearer)
    return JsonResponse({"errors": [
        {
            "id": "not-authorised",
            "status": 403,
            "title": _("Missing or malformed bearer")
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
                    "parameter": action.parameter,
                    "add": action.value
                }
            )
        elif action.action_type == ActionType.CHARACTER:
            response["attributes"]["actions"].append(
                {
                    "type": "setCharacter",
                    "character": action.character,
                }
            )
        elif action.action_type == ActionType.MESSAGE and game.hasMessages:
            response["attributes"]["actions"].append(
                {
                    "type": "sendMessage",
                    "message": action.message,
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
                "title": _("This QR code is already used")
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
        elif action.action_type == ActionType.MESSAGE and game.hasMessages:
            Message.objects.create(
                message=action.message,
                game=game
            )
        else:
            pass

    player = Player.objects.get(bearer=bearer)
    Log(game=game, code=code, player=player).save()
    return func_code_get(game, code)


@get_game_or_404
@has_bearer_or_403
def parameter(request, game):
    def get_bearer(request):
        return request.headers['Authorization']

    if request.method == 'GET':
        bearer = get_bearer(request)
        player = game.player.get(bearer=bearer)
        return func_parameter_get(game, player)
    elif request.method == 'POST':
        return func_parameter_post(game)


def func_parameter_get(game, player):
    # By retrieving the duration only once, then call `.value_at(dur)`
    # on every parameter instead of `.current_value`, we only need a
    # single SQL query for the duration instead of N, where N is the
    # number of parameters.
    dur = game.total_clock_duration

    response = []
    for parameter in game.parameter.all():
        response.append(
            {
                "type": "parameter",
                "id": parameter.name,
                "attributes": {
                    "scope": parameter.scope,
                    "value": parameter.value_at(dur),
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


@get_game_or_404
@has_bearer_or_403
def messages(request, game):
    if not game.hasMessages:
        return JsonResponse({"errors": [
            {
                "id": "messages-not-enabled",
                "status": 404,
                "title": _("Game does not have messages enabled")
            }
        ]}, status=404)

    return func_messages_get(game)


def func_messages_get(game):
    response = []
    for message in game.message.all():
        response.append({
            "type": "message",
            "id": message.id,
            "attributes": {
                "createdAt": message.created_at,
                "message": message.message
            }
        })

    return buildJsonResponse(response)
