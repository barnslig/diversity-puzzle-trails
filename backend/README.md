# App Backend

The Django based REST API that powers the Diversity Puzzle Trails App.

## Development Setup

Make sure to have Python 3.9 and pipenv installed on your system.

Then, install the pipenv within `backend/`:

```
$ pipenv install
```

To start the app, switch into `backend/dpt_app/`. Then, execute:

```
$ cp .env.example .env
$ python manage.py migrate
$ python manage.py runserver
```

You can now access the admin backend at [localhost:8000/admin](http://localhost:8000/admin/).

The default login credentials are: `admin` / `Tagungszentrum`.

## Translations

We make heavy use of Django's built-in translation feature for the admin backend.
See [Internationalization and ](https://docs.djangoproject.com/en/4.0/topics/i18n/) on how to apply i18n and translate strings.
For a quick overview, translation works as follows:

1. Make strings translatable using gettext functions
1. Run `python manage.py makemessages -l de` to update the `.po` file
1. Translate strings inside the `.po` file
1. Run `python manage.py compilemessages` to update the `.mo` file
1. Restart the (development) server
