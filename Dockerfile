FROM node:14-alpine AS app

COPY app /app
WORKDIR /app
RUN yarn
ENV API_ROOT=/api
RUN yarn build

FROM python:3.9-slim

RUN pip install pipenv gunicorn
WORKDIR /usr/src/app
COPY backend .
RUN mkdir /data
RUN pipenv install --deploy --system

RUN apt update && apt install -y \
  nginx-light \
  supervisor \
  && rm -rf /var/lib/apt/lists/*

COPY --from=app /app/dist /var/www/html
COPY docker /

WORKDIR /usr/src/app/dpt_app
RUN python manage.py collectstatic --no-input

EXPOSE 80

CMD ["/usr/bin/supervisord", "--nodaemon", "-c", "/etc/supervisor/supervisord.conf"]
