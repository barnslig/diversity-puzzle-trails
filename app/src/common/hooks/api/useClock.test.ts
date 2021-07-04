import { renderHook } from "@testing-library/react-hooks";

import useClock from "./useClock";

it("loads the clock", async () => {
  const { result, waitForValueToChange } = renderHook(() => useClock());

  await waitForValueToChange(() => result.current.data);
  expect(result.current.data).toEqual(
    require("../../../mocks/data/clock.json")
  );
});
