import * as React from "react";
import render from "../testing/render";

import ButtonProgressIndicator from "./ButtonProgressIndicator";

it("renders correctly", () => {
  const { container } = render(<ButtonProgressIndicator />);
  expect(container.firstChild).toMatchSnapshot();
});
