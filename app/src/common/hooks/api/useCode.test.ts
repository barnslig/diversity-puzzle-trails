import { renderHook } from "@testing-library/react-hooks";

import useCode from "./useCode";

it("loads a code", async () => {
  const { result, waitForValueToChange } = renderHook(() =>
    useCode("test-code")
  );

  await waitForValueToChange(() => result.current.data);
  expect(result.current.data).toEqual(require("../../../mocks/data/code.json"));
});

it("returns an error when a code is not found", async () => {
  const { result, waitForValueToChange } = renderHook(() =>
    useCode("not-found")
  );

  await waitForValueToChange(() => result.current.error);
  expect(result.current.error?.status).toEqual(404);
  expect(result.current.error?.info).toEqual(
    require("../../../mocks/data/code-not-found.json")
  );
});

it("returns an error when a code is already used", async () => {
  const { result, waitForValueToChange } = renderHook(() =>
    useCode("already-used")
  );

  await waitForValueToChange(() => result.current.error);
  expect(result.current.error?.status).toEqual(403);
  expect(result.current.error?.info).toEqual(
    require("../../../mocks/data/code-already-used.json")
  );
});
