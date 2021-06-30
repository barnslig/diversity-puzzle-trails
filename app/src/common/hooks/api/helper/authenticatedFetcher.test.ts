import authenticatedFetcher from "./authenticatedFetcher";

it("adds the Authorization header to the request", () => {
  window.fetch = jest.fn().mockImplementationOnce(async () => ({
    ok: true,
    json: () => {},
  }));

  authenticatedFetcher("test", "test123");

  expect(window.fetch).toHaveBeenCalledWith("test", {
    headers: {
      Authorization: "Bearer test123",
    },
  });
});
