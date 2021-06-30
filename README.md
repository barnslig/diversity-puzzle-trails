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
