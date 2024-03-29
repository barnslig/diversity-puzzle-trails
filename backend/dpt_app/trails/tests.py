from datetime import datetime
from django.core.serializers.json import DjangoJSONEncoder
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from unittest.mock import patch
import json

from .enums import ActionType, ClockType, ClockUnit, ParameterScope, ParameterType
from .models import Character, Game, Log, Message, Parameter, Player
from .qr_models import Action, Code

CLOCK_DURATION = 70
MAX_CLOCK_DURATION = 80


class GameTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.game: Game = Game.objects.create(
            name="Test Game",
            slug="test-game",
            hasMessages=True,
            clock_duration=CLOCK_DURATION,
            clock_unit=ClockUnit.SECONDS
        )

        # Manually set clock_last_change as it otherwise gets overridden by auto_now_add=True
        cls.game.clock_last_change = timezone.make_aware(
            datetime(2022, 1, 15, 12, 00))
        cls.game.save()

        cls.param: Parameter = Parameter.objects.create(
            name=ParameterType.ENERGY,
            scope=ParameterScope.GLOBAL,
            initial_value=100,
            min_value=0,
            max_value=500,
            rate=-1,
            game=cls.game
        )

        cls.param2: Parameter = Parameter.objects.create(
            name=ParameterType.FOOD,
            scope=ParameterScope.GLOBAL,
            initial_value=80,
            rate=-0.8,
            game=cls.game
        )

        cls.param3: Parameter = Parameter.objects.create(
            name=ParameterType.HYGIENE,
            scope=ParameterScope.GLOBAL,
            initial_value=120,
            rate=-1.5,
            game=cls.game
        )

        cls.character: Character = Character.objects.create(
            character_class="Ingenieur*in"
        )

        cls.player: Player = Player.objects.create(
            name="Test Player",
            bearer="Bearer test123",
            game=cls.game,
            character=cls.character,
            action_points=15
        )

        cls.message: Message = Message.objects.create(
            message="Test 123",
            game=cls.game
        )

        cls.code: Code = Code.objects.create(
            name="Test Send Message"
        )

        cls.action: Action = Action.objects.create(
            code=cls.code,
            action_type=ActionType.MESSAGE,
            message="Send Alpaca Pics"
        )

        cls.log: Log = Log.objects.create(
            game=cls.game,
            code=cls.code,
            player=cls.player
        )

    def cause_game_over(self):
        self.game.clock_state = ClockType.RUNNING
        self.game.clock_duration = MAX_CLOCK_DURATION
        self.game.save()


class GameModelTest(GameTestCase):
    def test_max_clock_duration(self):
        # it returns the maximum clock duration
        self.assertEqual(self.game.max_clock_duration, MAX_CLOCK_DURATION)

    def test_total_clock_duration(self):
        # it updates the total_clock_duration at maximum to the max_clock_duration
        self.assertEqual(self.game.clock_state, ClockType.STOPPED)
        self.assertEqual(self.game.total_clock_duration, CLOCK_DURATION)

        self.game.clock_duration = 9999
        self.assertEqual(self.game.total_clock_duration, MAX_CLOCK_DURATION)

        # it updates the total_clock_duration according to the current time when running
        with patch('django.utils.timezone.now') as mock_timezone_now:
            mock_timezone_now.return_value = datetime(2022, 1, 15, 12, 10)

            self.game.clock_state = ClockType.RUNNING
            self.assertEqual(self.game.total_clock_duration,
                             CLOCK_DURATION + 10)

            mock_timezone_now.return_value = datetime(2100, 1, 1, 0, 0)
            self.assertEqual(self.game.total_clock_duration,
                             MAX_CLOCK_DURATION)

    def test_is_game_over(self):
        # cause a game over
        self.cause_game_over()

        # it is in game over state
        self.assertEqual(self.game.is_game_over, True)

    def test_resolve_game_over_add_points(self):
        # it does nothing when the game is not in game over state
        self.assertEqual(self.game.is_game_over, False)
        self.assertEqual(self.game.resolve_game_over_add_points(10), None)

        # cause a game over
        self.cause_game_over()

        # it adds points and resolves the game over
        param = self.game.resolve_game_over_add_points(10)
        self.assertEqual(self.game.is_game_over, False)
        self.assertEqual(param, self.param3)
        self.assertEqual(param.current_value, 10)

    def test_resolve_game_over_add_time(self):
        # it adds time when the game is not in game over state
        self.assertEqual(self.game.is_game_over, False)

        current_total_duration = self.game.total_clock_duration
        self.game.resolve_game_over_add_time(10)

        self.assertEqual(self.game.is_game_over, False)
        self.assertEqual(self.game.clock_state, ClockType.RUNNING)
        self.assertAlmostEqual(
            self.game.total_clock_duration,
            current_total_duration - 10,
            0
        )

        # cause a game over
        self.cause_game_over()

        # it resolves a game over
        self.assertEqual(self.game.is_game_over, True)

        current_total_duration = self.game.total_clock_duration
        self.game.resolve_game_over_add_time(10)

        self.assertEqual(self.game.is_game_over, False)
        self.assertEqual(self.game.clock_state, ClockType.RUNNING)
        self.assertAlmostEqual(
            self.game.total_clock_duration,
            current_total_duration - 10,
            0
        )

        # it does not turn the game duration into negative time
        self.game.resolve_game_over_add_time(99999)
        self.assertAlmostEqual(self.game.total_clock_duration, 0, 0)

    def test_reset(self):
        self.assertNotEqual(self.game.logs.count(), 0)
        self.assertNotEqual(self.game.message.count(), 0)
        self.assertNotEqual(self.game.player.count(), 0)

        self.game.reset()

        # it resets the game clock duration to zero and stops the game
        self.assertEqual(self.game.clock_state, ClockType.STOPPED)
        self.assertEqual(self.game.total_clock_duration, 0)

        for param in self.game.parameter.all():
            self.assertEqual(param.value, 0)
            self.assertEqual(param.fixup_value, 0)

        # it deletes all logs, messages and players of the game
        self.assertEqual(self.game.logs.count(), 0)
        self.assertEqual(self.game.message.count(), 0)
        self.assertEqual(self.game.player.count(), 0)

    def test_update_clock_last_change(self):
        # it updates only the clock_last_change when switching the clock_state from stopped to running
        with patch('django.utils.timezone.now') as mock_timezone_now:
            self.assertEqual(self.game.clock_state, ClockType.STOPPED)

            now = timezone.make_aware(datetime(2022, 1, 15, 12, 10))
            mock_timezone_now.return_value = now

            self.game.clock_state = ClockType.RUNNING
            self.game.save()

            self.assertEqual(self.game.clock_state, ClockType.RUNNING)
            self.assertEqual(self.game.clock_last_change, now)
            self.assertEqual(self.game.clock_duration, CLOCK_DURATION)

        # it updates clock_last_change and clock_duration when switching the clock_state from running to stopped
        with patch('django.utils.timezone.now') as mock_timezone_now:
            self.assertEqual(self.game.clock_state, ClockType.RUNNING)

            now = timezone.make_aware(datetime(2022, 1, 15, 12, 20))
            mock_timezone_now.return_value = now

            self.game.clock_state = ClockType.STOPPED
            self.game.save()

            self.assertEqual(self.game.clock_state, ClockType.STOPPED)
            self.assertEqual(self.game.clock_last_change, now)
            self.assertEqual(self.game.clock_duration, CLOCK_DURATION + 10)

    def test_parameters_keep_value_on_clock_speed_change(self):
        initial_value = self.game.parameter.first().current_value

        # it keeps the parameter current_value on clock speed change
        self.game.clock_speed = 10
        self.game.save()

        self.assertEqual(
            initial_value,
            self.game.parameter.first().current_value
        )

        # it keeps the parameter current_value when changing back to the initial clock speed
        self.game.clock_speed = 1
        self.game.save()

        self.assertEqual(
            initial_value,
            self.game.parameter.first().current_value
        )


class ParameterModelTest(GameTestCase):
    def test_value_at(self):
        # it returns the parameter value at the requested game duration
        self.assertEqual(self.param.value_at(
            0), self.param.initial_value + self.param.value)

        # it does not go below the minimum parameter value
        self.assertEqual(self.param.value_at(99999999), self.param.min_value)

        # it does not go above the maximum parameter value
        self.assertEqual(self.param.value_at(-99999999), self.param.max_value)

    def test_current_value(self):
        # it returns the current parameter value
        self.assertEqual(self.param.current_value, 30)

    def test_game_clock_duration_when_value_zero(self):
        # it calculates the duration at which the parameter value first gets zero
        duration_when_zero = self.param.game_clock_duration_when_value_zero

        self.assertEqual(duration_when_zero, 100)
        self.assertEqual(self.param.value_at(duration_when_zero), 0)

    def test_keeps_value_on_rate_change(self):
        initial_value = self.param.current_value

        # it keeps the current_value on rate change
        self.param.rate = -0.1
        self.param.save()

        self.assertEqual(initial_value, self.param.current_value)

        # it keeps the current_value when changing back to the initial rate
        self.param.rate = -1
        self.param.save()

        self.assertEqual(initial_value, self.param.current_value)


class GameApiTest(GameTestCase):
    def test_get(self):
        url = reverse("api-1.0.0:gameManifest", args=(self.game.slug,))
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {
            "data": {
                "type": "game",
                "id": self.game.slug,
                "attributes": {
                    "hasMessages": self.game.hasMessages,
                    "hasUserParameterScope": self.game.hasUserParameterScope
                }
            }
        })


class ClockApiTest(GameTestCase):
    def test_get(self):
        url = reverse("api-1.0.0:clock", args=(self.game.slug,))
        res = self.client.get(url, HTTP_AUTHORIZATION=self.player.bearer)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {
            "data": {
                "type": "clock",
                "id": "1",
                "attributes": {
                    "state": "paused",
                    "speed": 1.0
                }
            }
        })


class PlayerApiTest(GameTestCase):
    def test_put(self):
        bearer = "Bearer test54321"

        url = reverse("api-1.0.0:player", args=(self.game.slug,))

        res = self.client.put(url, HTTP_AUTHORIZATION=bearer, data={
            "data": {
                "type": "player"
            }
        })

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {
            "data": {
                "type": "player",
                "id": "2",
                "attributes": {
                    "name": "Example Name",
                    "character": None
                }
            }
        })
        self.assertEqual(self.game.player.last().bearer, bearer)

    def test_put_again(self):
        # it creates no new player when the bearer is already known
        url = reverse("api-1.0.0:player", args=(self.game.slug,))

        res = self.client.put(url, HTTP_AUTHORIZATION=self.player.bearer, data={
            "data": {
                "type": "player"
            }
        })

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {
            "data": {
                "type": "player",
                "id": str(self.player.id),
                "attributes": {
                    "name": self.player.name,
                    "character": self.player.character.character_class
                }
            }
        })


class ParameterApiTest(GameTestCase):
    def test_get(self):
        url = reverse("api-1.0.0:parameter", args=(self.game.slug,))
        res = self.client.get(url, HTTP_AUTHORIZATION=self.player.bearer)

        self.assertEqual(res.status_code, 200)

        expect = [self.param,
                  self.param2,
                  self.param3,
                  Parameter(
                      game=self.game,
                      name="movements",
                      scope="user",
                      value=self.player.action_points,
                      initial_value=0,
                      rate=1,
                      min_value=0,
                      max_value=15)
                  ]

        resData = res.json()

        for i, param in enumerate(expect):
            self.assertEqual(resData["data"][i], {
                "type": "parameter",
                "id": param.name,
                "attributes": {
                    "scope": param.scope,
                    "value": param.current_value,
                    "rate": param.rate,
                    "min": param.min_value,
                    "max": param.max_value
                }
            })


class MessageApiTest(GameTestCase):
    def test_get(self):
        url = reverse("api-1.0.0:message", args=(self.game.slug,))

        # it returns the messages of a game
        self.assertTrue(self.game.hasMessages)

        res = self.client.get(url, HTTP_AUTHORIZATION=self.player.bearer)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {
            "data": [
                {
                    "type": "message",
                    "id": self.message.id,
                    "attributes": {
                        "createdAt": json.loads(json.dumps(self.message.created_at, cls=DjangoJSONEncoder)),
                        "message": self.message.message
                    }
                }
            ]
        })

    def test_get_game_has_no_messages(self):
        url = reverse("api-1.0.0:message", args=(self.game.slug,))

        # disable messages
        self.game.hasMessages = False
        self.game.save()

        # it returns 404 when messages are disabled
        self.assertFalse(self.game.hasMessages)

        res = self.client.get(url, HTTP_AUTHORIZATION=self.player.bearer)
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.json(), {
            "errors": [
                {
                    "id": "messages-not-enabled",
                    "status": 404,
                    "title": _("Game does not have messages enabled")
                }
            ]
        })

    def test_get_code(self):
        url = reverse("api-1.0.0:code", args=(self.game.slug, self.code.uuid,))

        # it includes sendMessage actions when messages are enabled
        self.assertTrue(self.game.hasMessages)

        res = self.client.get(url, HTTP_AUTHORIZATION=self.player.bearer)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {
            'data': {
                'type': 'code',
                'id': self.code.id,
                'attributes': {
                    'oneShot': False,
                    'actions': [
                        {
                            'type': 'sendMessage',
                            'message': self.action.message
                        }
                    ]
                }
            }
        })

    def test_get_code_game_has_no_messages(self):
        url = reverse("api-1.0.0:code", args=(self.game.slug, self.code.uuid,))

        # disable messages
        self.game.hasMessages = False
        self.game.save()

        # it excludes sendMessage actions when messages are disabled
        self.assertFalse(self.game.hasMessages)

        res = self.client.get(url, HTTP_AUTHORIZATION=self.player.bearer)
        self.assertEqual(res.status_code, 200)

        hasSendMessage = False
        for action in res.json()["data"]["attributes"]["actions"]:
            if action["type"] == "sendMessage":
                hasSendMessage = True
                break

        self.assertFalse(hasSendMessage)

    def test_post_code(self):
        url = reverse("api-1.0.0:code", args=(self.game.slug, self.code.uuid,))

        # it sends a message using a code
        self.assertTrue(self.game.hasMessages)

        res = self.client.post(url, HTTP_AUTHORIZATION=self.player.bearer)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(self.game.message.last().message, self.action.message)

    def test_post_code_game_has_no_messages(self):
        url = reverse("api-1.0.0:code", args=(self.game.slug, self.code.uuid,))

        # disable messages
        self.game.hasMessages = False
        self.game.save()

        # it does nothing when messages are disabled
        self.assertFalse(self.game.hasMessages)
        res = self.client.post(url, HTTP_AUTHORIZATION=self.player.bearer)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(self.game.message.filter(
            message=self.action.message).exists())
