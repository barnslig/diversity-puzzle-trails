import * as React from "react";

import renderWithIntl from "../../common/testing/renderWithIntl";

import IndexPage from "./IndexPage";

it("renders correctly", () => {
  const { container } = renderWithIntl(<IndexPage />);
  expect(container.firstChild).toMatchSnapshot();
});
