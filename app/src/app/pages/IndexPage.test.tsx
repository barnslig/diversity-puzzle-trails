import { rest } from "msw";
import { screen, waitFor } from "@testing-library/react";
import * as React from "react";

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
      const data = require("../../mocks/data/clock.json");
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
