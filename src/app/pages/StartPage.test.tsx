import { screen, waitFor } from "@testing-library/react";
import * as React from "react";
import userEvent from "@testing-library/user-event";

import renderWithIntl from "../../common/testing/renderWithIntl";

import StartPage from "./StartPage";

const useJoinGame = jest.fn();
jest.mock("../../common/hooks/useJoinGame", () => ({
  default: () => useJoinGame,
}));

it("renders nothing when a game id is supplied", () => {
  const { container } = renderWithIntl(<StartPage gameId="foobar" />);
  expect(container.firstChild).toBe(null);
});

it("sets the game id when a game id is supplied", async () => {
  renderWithIntl(<StartPage gameId="foobar" />);
  await waitFor(() => expect(useJoinGame).toHaveBeenCalledWith("foobar"));
});

it("renders correctly when no game id is supplied", () => {
  const { container } = renderWithIntl(<StartPage />);
  expect(container.firstChild).toMatchSnapshot();
});

it("lets the user input a game id when no game id is supplied", async () => {
  renderWithIntl(<StartPage />);

  userEvent.type(screen.getByLabelText(/Spiel-Code/i), "test-123");
  userEvent.click(screen.getByText(/Am Spiel teilnehmen/i));

  await waitFor(() => expect(useJoinGame).toHaveBeenCalledWith("test-123"));
});