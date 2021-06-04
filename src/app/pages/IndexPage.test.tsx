import * as React from "react";

import render from "../../common/testing/render";

import IndexPage from "./IndexPage";

it("renders correctly", () => {
  const { container } = render(<IndexPage />);
  expect(container.firstChild).toMatchSnapshot();
});
