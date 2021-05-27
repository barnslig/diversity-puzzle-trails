import { renderHook } from "@testing-library/react-hooks";

import * as useGameId from "../useGameId";
import useApiUrl from "./useApiUrl";

jest.mock("../../../config", () => ({
  default: {
    apiRoot: "https://example.com/api/",
  },
}));

it("creates no API URL when no game id is available", () => {
  jest.spyOn(useGameId, "default").mockReturnValue([null, () => {}, () => {}]);

  const { result } = renderHook(() => useApiUrl("/parameters"));
  expect(result.current).toBe(null);
});

it("creates an absolute API URL when a game id is available", () => {
  jest
    .spyOn(useGameId, "default")
    .mockReturnValue(["foobar", () => {}, () => {}]);

  const { result } = renderHook(() => useApiUrl("/parameters"));

  expect(result.current).toBe(
    "https://example.com/api/games/foobar/parameters"
  );
});
