# ABC Diversity Puzzle Trails

This is the monorepo for the ABC Diversity Puzzle Trails Companion App.

Issue overview: [Project Board](https://github.com/barnslig/diversity-puzzle-trails/projects/1)

## Technical Documentation

The technical documentation is targeted at a technical audience and represents the most recent state of the technical architecture.

Link: [Technical Documentation](https://abc-dpt-docs.netlify.app/)

### Working on the documentation

The documentation is written in Markdown, located at `docs/` and build using [mdBook](https://github.com/rust-lang/mdBook).

On `git push`, the Netlify deployment is automatically updated.

In order to build it locally, make sure to have mdBook installed on your machine. Then, within the project root, execute:

```
mdbook serve
```

## App Frontend

See [app/README.md](app/README.md).

## App Backend

See [backend/README.md](backend/README.md).

## Production Setup

The production setup is done using a single Docker container.

To build the Docker container, execute:

```
$ docker build -t abc-dpt .
```

To run the Docker container, execute:

```
$ docker run --rm -p 8000:80 -v data:/data abc-dpt
```

You can now access the app at [localhost:8000](http://localhost:8000).

To persist the database and media files, make sure to provide a volume for `/data`.

The web server is exposed at port 80.

The behavior of the container can be changed by overriding environment variables. Check out the example `.env` file for a list of variables: [.env.example](backend/dpt_app/.env.example).
