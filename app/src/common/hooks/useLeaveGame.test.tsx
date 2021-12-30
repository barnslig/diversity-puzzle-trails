import { screen } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import * as React from "react";
import render from "../testing/render";

import * as useCharacter from "./useCharacter";
import * as useGameId from "./useGameId";
import useLeaveGame from "./useLeaveGame";

const TestComponent = () => {
  const leaveGame = useLeaveGame();

  React.useEffect(() => {
    leaveGame();
  }, [leaveGame]);

  return null;
};

it("leaves the game", async () => {
  const deleteCharacter = jest.fn();
  jest
    .spyOn(useCharacter, "default")
    .mockReturnValue(["", () => {}, deleteCharacter]);

  const deleteGameId = jest.fn();
  jest
    .spyOn(useGameId, "default")
    .mockReturnValue(["", () => {}, deleteGameId]);

  render(<TestComponent />);

  await waitFor(() => {
    expect(deleteCharacter).toHaveBeenCalled();
    expect(deleteGameId).toHaveBeenCalled();
    expect(
      screen.getByText(/Spiel erfolgreich verlassen!/)
    ).toBeInTheDocument();
    expect(window.location.pathname).toEqual("/start");
  });
});
