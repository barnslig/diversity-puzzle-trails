from django.db.models import F
from django.http import HttpRequest
from django.utils.translation import gettext_lazy as _
from functools import wraps
from ninja import NinjaAPI

from .enums import ClockType, ActionType
from .models import Game, Log, Message, Parameter, Player, Character
from .qr_models import Code
from .schemas import ClockSchema, GameSchema, PlayerSchema

api = NinjaAPI()


class CodeAlreadyUsed(Exception):
    pass


@api.exception_handler(CodeAlreadyUsed)
def code_already_used(request, exc):
    return api.create_response(
        request,
        {
            "errors": [
                {
                    "id": "already-used",
                    "status": 403,
                    "title": _("This QR code is already used")
                }
            ]
        },
        status=403,
    )


class CodeNotFound(Exception):
    pass


@api.exception_handler(CodeNotFound)
def code_not_found(request, exc):
    return api.create_response(
        request,
        {
            "errors": [
                {
                    "id": "code-not-found",
                    "status": 404,
                    "title": _("Unknown QR code ID")
                }
            ]
        },
        status=404,
    )


class GameNotFound(Exception):
    pass


@api.exception_handler(GameNotFound)
def game_not_found(request, exc):
    return api.create_response(
        request,
        {
            "errors": [
                {
                    "id": "game-not-found",
                    "status": 404,
                    "title": _("Unknown Game ID")
                }
            ]
        },
        status=404,
    )


class PlayerNotAuthorized(Exception):
    pass


@api.exception_handler(PlayerNotAuthorized)
def player_not_authorized(request, exc):
    return api.create_response(
        request,
        {
            "errors": [
                {
                    "id": "not-authorised",
                    "status": 403,
                    "title": _("Missing or malformed bearer")
                }
            ]
        },
        status=403,
    )


class MessagesNotEnabled(Exception):
    pass


@api.exception_handler(MessagesNotEnabled)
def messages_not_enabled(request, exc):
    return api.create_response(
        request,
        {
            "errors": [
                {
                    "id": "messages-not-enabled",
                    "status": 404,
                    "title": _("Game does not have messages enabled")
                }
            ]
        },
        status=404,
    )


def wrap_get_game(func):
    @wraps(func)
    def inner(request: HttpRequest, gameId: str, *args, **kwargs):
        try:
            request.game = Game.objects.get(slug=gameId)

            return func(request, gameId, *args, **kwargs)
        except Game.DoesNotExist:
            raise GameNotFound()

    return inner


def wrap_get_player(func):
    @wraps(func)
    def inner(request: HttpRequest, *args, **kwargs):
        try:
            bearer = request.headers["Authorization"]
            request.player = request.game.player.get(bearer=bearer)

            return func(request, *args, **kwargs)
        except (KeyError, Player.DoesNotExist):
            raise PlayerNotAuthorized()

    return inner


def serialize_game(game: Game):
    return {
        "data": {
            "type": "game",
            "id": game.slug,
            "attributes": {
                "hasMessages": game.hasMessages,
                "hasUserParameterScope": game.hasUserParameterScope
            }
        }
    }


@api.get("games/{str:gameId}", response=GameSchema, url_name="gameManifest")
@wrap_get_game
def get_game(request: HttpRequest, gameId: str):
    return serialize_game(request.game)


def serialize_clock(game: Game):
    state = game.clock_state
    if state == ClockType.STOPPED:
        state = "paused"

    return {
        "data": {
            "type": "clock",
            "id": game.id,
            "attributes": {
                "state": state,
                "speed": game.clock_speed
            }
        }
    }


@api.get("games/{str:gameId}/clock", response=ClockSchema, url_name="clock")
@wrap_get_game
@wrap_get_player
def get_clock(request: HttpRequest, gameId: str):
    return serialize_clock(request.game)


@api.post("games/{str:gameId}/clock", response=ClockSchema, url_name="clock")
@wrap_get_game
@wrap_get_player
def post_clock(request: HttpRequest, gameId: str, payload: ClockSchema):
    if payload.data.attributes.state == "running":
        request.game.clock_state = ClockType.RUNNING
    elif payload.data.attributes.state == "paused":
        request.game.clock_state = ClockType.STOPPED

    request.game.save()

    return serialize_clock(request.game)


def serialize_player(player: Player):
    character = None
    if player.character:
        character = player.character.character_class

    return {
        "data": {
            "type": "player",
            "id": player.id,
            "attributes": {
                "name": player.name,
                "character": character
            }
        }
    }


@api.put("games/{str:gameId}/players", response=PlayerSchema, url_name="player")
@wrap_get_game
def put_player(request: HttpRequest, gameId: str):
    player, _ = Player.objects.get_or_create(
        bearer=request.headers["Authorization"],
        game=request.game,
        defaults={
            "name": "Example Name"
        }
    )
    return serialize_player(player)


def serialize_code(code: Code, game: Game):
    actions = []
    for action in code.actions.all():
        if action.action_type == ActionType.PARAMETER:
            actions.append(
                {
                    "type": "changeParameter",
                    "parameter": action.parameter,
                    "add": action.value
                }
            )
        elif action.action_type == ActionType.CHARACTER:
            actions.append(
                {
                    "type": "setCharacter",
                    "character": action.character.character_class,
                }
            )
        elif action.action_type == ActionType.MESSAGE and game.hasMessages:
            actions.append(
                {
                    "type": "sendMessage",
                    "message": action.message,
                }
            )

    return {
        "data": {
            "type": "code",
            "id": code.id,
            "attributes": {
                "oneShot": code.one_shot,
                "actions": actions
            }
        }
    }


@api.get("games/{str:gameId}/codes/{str:codeId}", url_name="code")
@wrap_get_game
@wrap_get_player
def get_code(request: HttpRequest, gameId: str, codeId: str):
    try:
        code = Code.objects.get(uuid=codeId)
        return serialize_code(code, request.game)
    except Code.DoesNotExist:
        raise CodeNotFound()


@api.post("games/{str:gameId}/codes/{str:codeId}", url_name="code")
@wrap_get_game
@wrap_get_player
def post_code(request: HttpRequest, gameId: str, codeId: str):
    try:
        code = Code.objects.get(uuid=codeId)
    except Code.DoesNotExist:
        raise CodeNotFound()

    if code.one_shot and request.game.logs.filter(id=code.id).exists():
        raise CodeAlreadyUsed()

    for action in code.actions.all():
        if action.action_type == ActionType.PARAMETER:
            try:
                parameter = Parameter.objects.filter(
                    name=action.parameter,
                    game=request.game
                )
                parameter.update(value=F("value") + action.value)
            except:
                pass
        elif action.action_type == ActionType.CHARACTER:
            try:
                request.player.character = action.character
                request.player.save()
            except:
                pass
        elif action.action_type == ActionType.MESSAGE and request.game.hasMessages:
            Message.objects.create(
                message=action.message,
                game=request.game
            )

    Log.objects.create(game=request.game, code=code, player=request.player)

    return serialize_code(code, request.game)


def serialize_parameters(game: Game, player: Player):
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

    return {
        "data": response
    }


@api.get("games/{str:gameId}/parameters", url_name="parameter")
@wrap_get_game
@wrap_get_player
def get_parameters(request: HttpRequest, gameId: str):
    return serialize_parameters(request.game, request.player)


def serialize_messages(game: Game):
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

    return {
        "data": response
    }


@api.get("games/{str:gameId}/messages", url_name="message")
@wrap_get_game
@wrap_get_player
def get_messages(request: HttpRequest, gameId: str):
    if not request.game.hasMessages:
        raise MessagesNotEnabled()

    return serialize_messages(request.game)
