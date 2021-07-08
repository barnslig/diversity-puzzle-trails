import * as React from "react";
import render from "../testing/render";

import GameOverHeroMessage from "./GameOverHeroMessage";

it("renders correctly", () => {
  const { container } = render(<GameOverHeroMessage />);
  expect(container.firstChild).toMatchSnapshot();
});
