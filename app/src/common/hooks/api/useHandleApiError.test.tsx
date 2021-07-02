import { waitFor, screen } from "@testing-library/react";
import * as React from "react";

import render from "../../testing/render";

import ApiError from "./helper/ApiError";
import useHandleApiError from "./useHandleApiError";

const error = new ApiError("test error");

const errorWithInfo = new ApiError("test error", 400, {
  errors: [
    {
      id: "test-error",
      status: 400,
      title: "test error 123",
    },
  ],
});

/* Create a wrapper component that can be used instead of
 * `renderHook()` so `screen` is actually populated.
 * See https://github.com/testing-library/react-hooks-testing-library/issues/86#issuecomment-666212204
 */
const CreateTestComponent = (error: ApiError) => () => {
  const handleError = useHandleApiError();

  React.useEffect(() => {
    handleError(error);
  }, []);

  return null;
};

it("enqueues an error snack with a title", async () => {
  const Component = CreateTestComponent(errorWithInfo);
  render(<Component />);

  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent("test error 123");
});

it("enqueues an error with a default error message when no info is available", async () => {
  const Component = CreateTestComponent(error);
  render(<Component />);

  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Ein Fehler ist aufgetreten!"
  );
});
