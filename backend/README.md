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
