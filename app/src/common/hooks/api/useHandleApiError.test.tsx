import { waitFor, screen } from "@testing-library/react";
import * as React from "react";

import render from "../../testing/render";

import * as useCharacter from "../useCharacter";
import * as useGameId from "../useGameId";
import ApiError from "./helper/ApiError";
import useHandleApiError from "./useHandleApiError";

const error = new ApiError("test error");

const errorWithInfo = new ApiError("test error", 400, {
  errors: [
    {
      id: "unknown-error",
      status: 400,
      title: "test error 123",
    },
    {
      id: "unknown-error",
      status: 500,
      title: "other test error 1234",
    },
  ],
});

/* Create a component that can be used instead of `renderHook()` so
 * `screen` is actually populated.
 * See https://github.com/testing-library/react-hooks-testing-library/issues/86#issuecomment-666212204
 */
type TestComponentProps = {
  error: ApiError;
};
const TestComponent = ({ error }: TestComponentProps) => {
  const handleError = useHandleApiError();

  React.useEffect(() => {
    handleError(error);
  }, [handleError, error]);

  return null;
};

it("enqueues an error snack with a title", async () => {
  render(<TestComponent error={errorWithInfo} />);

  await waitFor(() => {
    const errors = screen.getAllByRole("alert");
    expect(errors[0]).toHaveTextContent("test error 123");
    expect(errors[1]).toHaveTextContent("other test error 1234");
  });
});

it("enqueues an error with a default error message when no info is available", async () => {
  render(<TestComponent error={error} />);

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ein Fehler ist aufgetreten!"
    );
  });
});

it("resets the game when a game-not-found error appears", async () => {
  const deleteCharacter = jest.fn();
  jest
    .spyOn(useCharacter, "default")
    .mockReturnValue(["", () => {}, deleteCharacter]);

  const deleteGameId = jest.fn();
  jest
    .spyOn(useGameId, "default")
    .mockReturnValue(["", () => {}, deleteGameId]);

  const error = new ApiError("test error", 404, {
    errors: [
      {
        id: "game-not-found",
        status: 404,
        title: "Unknown game",
      },
    ],
  });

  render(<TestComponent error={error} />);

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent("Unknown game");
  });

  expect(deleteCharacter).toHaveBeenCalled();
  expect(deleteGameId).toHaveBeenCalled();
});
