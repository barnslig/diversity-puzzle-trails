import ApiError from "./ApiError";
import errorAwareFetcher from "./errorAwareFetcher";

it("throws an error when the response is not ok", async () => {
  const mockError = {
    errors: [
      {
        id: "unknown-error",
        status: 500,
        title: "Unknown error",
      },
    ],
  };

  window.fetch = jest.fn().mockImplementationOnce(async () => ({
    ok: false,
    status: 404,
    json: () => mockError,
  }));

  await expect(errorAwareFetcher(() => fetch("test"))).rejects.toEqual(
    new ApiError("An error occurred while fetching the data.", 404, mockError)
  );
});
