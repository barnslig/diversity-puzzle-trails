import * as React from "react";
import render from "../testing/render";

import ChooseCharacterHeroMessage from "./ChooseCharacterHeroMessage";

it("renders correctly", () => {
  const { container } = render(<ChooseCharacterHeroMessage />);
  expect(container.firstChild).toMatchSnapshot();
});
