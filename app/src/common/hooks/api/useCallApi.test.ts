import { act, renderHook } from "@testing-library/react-hooks";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import { TestWrapper } from "../../testing/render";
import useCallApi from "./useCallApi";

it.skip("returns data on a successfull request", async () => {
  server.use(
    rest.get("http://localhost/test", (req, res, ctx) =>
      res(ctx.delay(1000), ctx.json({ foo: "bar" }))
    )
  );

  const { result, waitFor } = renderHook(
    () => useCallApi("http://localhost/test"),
    {
      wrapper: TestWrapper,
    }
  );
  const [isLoading, callApi] = result.current;

  expect(isLoading).toBe(false);

  let res;
  act(() => {
    res = callApi();
  });

  await waitFor(() => expect(isLoading).toBe(true));
  expect(await res).toEqual({ foo: "bar" });
  expect(isLoading).toBe(false);
});
