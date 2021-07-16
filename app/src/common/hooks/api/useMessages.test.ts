import { renderHook } from "@testing-library/react-hooks";

import useMessages from "./useMessages";

it("loads the messages", async () => {
  const { result, waitForValueToChange } = renderHook(() => useMessages());

  await waitForValueToChange(() => result.current.data);
  expect(result.current.data).toEqual(
    require("../../../mocks/data/messages.json")
  );
});
