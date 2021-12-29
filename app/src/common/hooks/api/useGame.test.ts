import { renderHook } from "@testing-library/react-hooks";

import * as useGameId from "../useGameId";
import useGame from "./useGame";

it("loads the game", async () => {
  const { result, waitForValueToChange } = renderHook(() => useGame());

  await waitForValueToChange(() => result.current.data);
  expect(result.current.data).toEqual(require("../../../mocks/data/game.json"));
});

it("returns an error when the game is not found", async () => {
  jest
    .spyOn(useGameId, "default")
    .mockReturnValue(["not-found", () => {}, () => {}]);

  const { result, waitForValueToChange } = renderHook(() => useGame());

  await waitForValueToChange(() => result.current.error);
  expect(result.current.error?.info).toEqual(
    require("../../../mocks/data/game-not-found.json")
  );
});
