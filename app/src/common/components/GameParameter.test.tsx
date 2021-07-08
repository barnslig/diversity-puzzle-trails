import * as React from "react";
import render from "../testing/render";

import GameParameter from "./GameParameter";

it("renders correctly", () => {
  const { container } = render(
    <GameParameter icon="" value="37" label="Bewegungspunkte" />
  );
  expect(container.firstChild).toMatchSnapshot();
});
