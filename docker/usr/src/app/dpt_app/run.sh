#!/bin/sh

./manage.py migrate
gunicorn -b [::]:8000 dpt_app.wsgi:application
