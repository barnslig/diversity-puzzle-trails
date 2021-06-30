import { rest } from "msw";

export const handlers = [
  rest.get("/games/:gameId/clock", (req, res, ctx) => {
    return res(ctx.json(require("./data/clock.json")));
  }),
  rest.patch("/games/:gameId/clock", (req, res, ctx) => {
    return res(ctx.json(require("./data/clock.json")));
  }),

  rest.get("/games/:gameId/codes/:codeId", (req, res, ctx) => {
    if (req.params.codeId === "already-used") {
      return res(
        ctx.status(403),
        ctx.json(require("./data/code-already-used.json"))
      );
    }

    if (req.params.codeId === "not-found") {
      return res(
        ctx.status(404),
        ctx.json(require("./data/code-not-found.json"))
      );
    }

    return res(ctx.json(require("./data/code.json")));
  }),
  rest.post("/games/:gameId/codes/:codeId", (req, res, ctx) => {
    return res(ctx.json(require("./data/code.json")));
  }),

  rest.get("/games/:gameId/parameters", (req, res, ctx) => {
    return res(ctx.json(require("./data/parameters.json")));
  }),
];
