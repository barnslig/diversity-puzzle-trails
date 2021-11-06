import { rest } from "msw";
import { screen, waitFor } from "@testing-library/react";
import * as React from "react";

import { ClockApiResponse } from "../../common/hooks/api/useClock";
import { ParameterApiResponse } from "../../common/hooks/api/useParameters";
import { server } from "../../mocks/server";
import * as useCharacter from "../../common/hooks/useCharacter";
import render from "../../common/testing/render";

import IndexPage from "./IndexPage";

it("initially asks the user to choose a character", () => {
  const { container } = render(<IndexPage />);

  expect(screen.getByText(/Charakter wählen/)).toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot();
});

it("shows the parameters when a character is set", async () => {
  jest
    .spyOn(useCharacter, "default")
    .mockReturnValue(["engineer", () => {}, () => {}]);

  const { container } = render(<IndexPage />);

  await waitFor(() =>
    expect(screen.getByText(/Bewegungspunkte/)).toBeInTheDocument()
  );
  expect(container.firstChild).toMatchSnapshot();
});

it("can show the game is paused message", async () => {
  jest
    .spyOn(useCharacter, "default")
    .mockReturnValue(["engineer", () => {}, () => {}]);

  server.use(
    rest.get("/games/:gameId/clock", (req, res, ctx) => {
      const data: ClockApiResponse = require("../../mocks/data/clock.json");
      data.data.attributes.state = "paused";
      return res(ctx.json(data));
    })
  );

  const { container } = render(<IndexPage />);

  await waitFor(() =>
    expect(screen.getByText(/Spiel pausiert/)).toBeInTheDocument()
  );
  expect(container.firstChild).toMatchSnapshot();
});

it("can show the game is over", async () => {
  jest
    .spyOn(useCharacter, "default")
    .mockReturnValue(["engineer", () => {}, () => {}]);

  server.use(
    rest.get("/games/:gameId/parameters", (req, res, ctx) => {
      const data: ParameterApiResponse = require("../../mocks/data/parameters.json");

      /* A game over occures when at least one global parameter's value
       * is lower or equal to its minimum. Here, we set the value of the
       * first global parameter to its minimum to test this behaviour.
       */
      for (let i = 0; i < data.data.length; i += 1) {
        if (data.data[i].attributes.scope === "global") {
          data.data[i].attributes.value = data.data[i].attributes.min;
          break;
        }
      }

      return res(ctx.json(data));
    })
  );

  const { container } = render(<IndexPage />);

  await waitFor(() =>
    expect(screen.getByText(/Game Over/)).toBeInTheDocument()
  );
  expect(container.firstChild).toMatchSnapshot();
});
