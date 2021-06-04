import { renderHook } from "@testing-library/react-hooks";

import * as useGameId from "../useGameId";
import useApiUrl from "./useApiUrl";

it("creates no API URL when no game id is available", () => {
  jest
    .spyOn(useGameId, "default")
    .mockReturnValueOnce([null, () => {}, () => {}]);

  const { result } = renderHook(() => useApiUrl("/parameters"));
  expect(result.current).toBe(null);
});

it("creates an absolute API URL when a game id is available", () => {
  const { result } = renderHook(() => useApiUrl("/parameters"));
  expect(result.current).toBe("http://localhost/games/test-game/parameters");
});
