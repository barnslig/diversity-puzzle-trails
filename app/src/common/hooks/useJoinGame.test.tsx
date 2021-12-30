import { screen } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import * as React from "react";
import render from "../testing/render";

import * as useCharacter from "./useCharacter";
import * as useGameId from "./useGameId";
import useJoinGame from "./useJoinGame";

type TestComponentProps = {
  gameId: string;
};

const TestComponent = ({ gameId }: TestComponentProps) => {
  const joinGame = useJoinGame();

  React.useEffect(() => {
    const f = async () => {
      try {
        await joinGame(gameId);
      } catch (e) {}
    };
    f();
  }, [gameId, joinGame]);

  return null;
};

it("joins a new game when the manifest is available", async () => {
  const deleteCharacter = jest.fn();
  jest
    .spyOn(useCharacter, "default")
    .mockReturnValue(["", () => {}, deleteCharacter]);

  const setGameId = jest.fn();
  jest.spyOn(useGameId, "default").mockReturnValue(["", setGameId, () => {}]);

  render(<TestComponent gameId="test-game" />);

  await waitFor(() => {
    expect(deleteCharacter).toHaveBeenCalled();
    expect(setGameId).toHaveBeenCalledWith("test-game");
    expect(
      screen.getByText(/Du bist jetzt Teil vom Spiel!/)
    ).toBeInTheDocument();
    expect(window.location.pathname).toEqual("/");
  });
});

it("resets the game when no manifest is available", async () => {
  const deleteCharacter = jest.fn();
  jest
    .spyOn(useCharacter, "default")
    .mockReturnValue(["", () => {}, deleteCharacter]);

  const deleteGameId = jest.fn();
  jest
    .spyOn(useGameId, "default")
    .mockReturnValue(["", () => {}, deleteGameId]);

  render(<TestComponent gameId="not-found" />);

  await waitFor(() => {
    expect(deleteCharacter).toHaveBeenCalled();
    expect(deleteGameId).toHaveBeenCalled();
  });
});
