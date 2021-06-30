import { renderHook } from "@testing-library/react-hooks";
import { Parameter } from "../../types/Parameter";

import { useParameters, useScopedParameterResponse } from "./useParameters";

const mockResponse = require("../../../mocks/data/parameters.json");

it("loads the parameters", async () => {
  const { result, waitForValueToChange } = renderHook(() => useParameters());

  await waitForValueToChange(() => result.current.data);
  expect(result.current.data).toEqual(mockResponse);
});

it("filters the parameters by scope", () => {
  const expected: Parameter[] = [
    {
      type: "parameter",
      id: "movements",
      attributes: {
        scope: "user",
        value: 7,
        rate: 0.1,
        min: 0,
        max: 99999,
      },
    },
  ];

  const { result } = renderHook(() =>
    useScopedParameterResponse("user", mockResponse)
  );
  expect(result.current).toEqual(expected);
});
