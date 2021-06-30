import * as React from "react";
import render from "../../common/testing/render";

import ChooseCharacter from "./ChooseCharacter";

it("renders correctly", () => {
  const { container } = render(<ChooseCharacter />);
  expect(container.firstChild).toMatchSnapshot();
});
