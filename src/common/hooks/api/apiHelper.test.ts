import { authenticatedFetcher, pathJoin } from "./apiHelper";

it("joins a path", () => {
  expect(pathJoin("foo", "bar", "baz")).toBe("foo/bar/baz");
  expect(pathJoin("/foo//", "/bar/", "baz/")).toBe("foo/bar/baz");
  expect(pathJoin("////foo//", "/bar/", "/baz")).toBe("foo/bar/baz");
});

it("adds the Authorization header to the request", () => {
  global.fetch = jest.fn().mockImplementation(async () => ({ json: () => {} }));

  authenticatedFetcher("test", "test123");

  expect(global.fetch).toHaveBeenCalledWith("test", {
    headers: {
      Authorization: "Bearer test123",
    },
  });
});
