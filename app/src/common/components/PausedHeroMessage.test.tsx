import * as React from "react";
import render from "../testing/render";

import PausedHeroMessage from "./PausedHeroMessage";

it("renders correctly", () => {
  const { container } = render(<PausedHeroMessage />);
  expect(container.firstChild).toMatchSnapshot();
});
