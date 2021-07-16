import { rest } from "msw";
import { screen, waitFor } from "@testing-library/react";
import * as React from "react";

import { server } from "../../mocks/server";
import MessagesPage from "./MessagesPage";
import render from "../../common/testing/render";

it("renders a loading screen", () => {
  render(<MessagesPage />);

  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

it("renders messages", async () => {
  const { container } = render(<MessagesPage />);

  await waitFor(() => expect(screen.getByText(/Test 123/)).toBeInTheDocument());
  expect(container.firstChild).toMatchSnapshot();
});

it("renders no messages yet hero message", async () => {
  server.use(
    rest.get("/games/:gameId/messages", (req, res, ctx) => {
      return res(
        ctx.json({
          data: [],
        })
      );
    })
  );

  const { container } = render(<MessagesPage />);

  await waitFor(() =>
    expect(
      screen.getByText(/Es gibt noch keine Nachrichten/)
    ).toBeInTheDocument()
  );
  expect(container.firstChild).toMatchSnapshot();
});
