import argparse
import csv
from django.core.management.base import BaseCommand, CommandError, CommandParser
from typing import Any, Optional

from trails.enums import ActionType
from trails.models import Character
from trails.qr_models import Code, Action


class Command(BaseCommand):
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument('csv', help='The CSV file',
                            type=argparse.FileType('r'))

    def handle(self, *args: Any, **options: Any) -> Optional[str]:
        data = csv.reader(options['csv'])

        # first row is the header
        header = next(data)

        if header != ['uuid', 'one_shot', 'name', 'character']:
            raise CommandError('Header is not correct')

        for row in data:
            # convert rows lists to dicts
            row = dict(zip(header, row))

            code, created = Code.objects.update_or_create(
                uuid=row['uuid'],
                defaults={
                    'uuid': row['uuid'],
                    'one_shot': row['one_shot'] == '1',
                    'name': row['name']
                }
            )

            character, created = Character.objects.update_or_create(
                character_class=row['character']
            )

            Action.objects.update_or_create(
                code=code,
                defaults={
                    'action_type': ActionType.CHARACTER,
                    'character': character
                }
            )
