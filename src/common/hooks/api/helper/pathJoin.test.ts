import pathJoin from "./pathJoin";

it("joins a path", () => {
  expect(pathJoin("foo", "bar", "baz")).toBe("foo/bar/baz");
  expect(pathJoin("/foo//", "/bar/", "baz/")).toBe("foo/bar/baz");
  expect(pathJoin("////foo//", "/bar/", "/baz")).toBe("foo/bar/baz");
  expect(pathJoin("foo///bar", "baz/")).toBe("foo/bar/baz");
});
