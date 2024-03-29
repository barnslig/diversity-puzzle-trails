import { screen, waitFor } from "@testing-library/react";
import * as React from "react";
import userEvent from "@testing-library/user-event";

import render from "../../common/testing/render";

import StartPage from "./StartPage";

const mockUseJoinGame = jest.fn();
jest.mock("../../common/hooks/useJoinGame", () => ({
  __esModule: true,
  default: () => mockUseJoinGame,
}));

it("renders nothing when a game id is supplied", async () => {
  const { container } = render(<StartPage gameId="foobar" />);
  await waitFor(() => expect(container.firstChild).not.toBeVisible());
});

it("sets the game id when a game id is supplied", async () => {
  render(<StartPage gameId="foobar" />);
  await waitFor(() => expect(mockUseJoinGame).toHaveBeenCalledWith("foobar"));
});

it("renders correctly when no game id is supplied", () => {
  const { container } = render(<StartPage />);
  expect(container.firstChild).toMatchSnapshot();
});

it("lets the user input a game id when no game id is supplied", async () => {
  render(<StartPage />);

  userEvent.type(screen.getByLabelText(/Spiel-Code/i), "test-123");
  userEvent.click(screen.getByText(/Am Spiel teilnehmen/i));

  await waitFor(() => expect(mockUseJoinGame).toHaveBeenCalledWith("test-123"));
});
