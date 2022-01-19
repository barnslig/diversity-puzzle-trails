from datetime import datetime
from django.test import TestCase
from django.utils import timezone
from unittest.mock import patch

from .enums import CharacterType, ClockType, ParameterScope, ParameterType
from .models import Character, Game, Parameter, Player

CLOCK_DURATION = 70
MAX_CLOCK_DURATION = 80


class GameTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.game: Game = Game.objects.create(
            name="Test Game",
            slug="test-game",
            clock_duration=CLOCK_DURATION
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

        cls.character = Character.objects.create(
            character_class=CharacterType.ENGINEER
        )

        cls.player = Player.objects.create(
            name="Test Player",
            bearer="Bearer test123",
            game=cls.game,
            character=cls.character
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
        self.game.reset()

        # it resets the game clock duration to zero and stops the game
        self.assertEqual(self.game.clock_state, ClockType.STOPPED)
        self.assertEqual(self.game.total_clock_duration, 0)

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
