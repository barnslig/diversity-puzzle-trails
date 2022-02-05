#!/bin/sh

./manage.py migrate
gunicorn dpt_app.wsgi:application
