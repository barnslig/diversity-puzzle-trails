import { rest } from "msw";

import { ClockApiResponse } from "../common/hooks/api/useClock";
import { ClockState } from "../common/types/Clock";

let clockState: ClockState = "running";

export const handlers = [
  rest.get("/games/:gameId/clock", (req, res, ctx) => {
    const clockRes: ClockApiResponse = require("./data/clock.json");
    clockRes.data.attributes.state = clockState;
    return res(ctx.json(clockRes));
  }),
  rest.post("/games/:gameId/clock", (req, res, ctx) => {
    clockState =
      JSON.parse(req.body as string).data.attributes.state || "running";

    const clockRes: ClockApiResponse = require("./data/clock.json");
    clockRes.data.attributes.state = clockState;
    return res(ctx.json(clockRes));
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
