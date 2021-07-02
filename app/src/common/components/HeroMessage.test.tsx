import * as React from "react";
import render from "../testing/render";

import HeroMessage from "./HeroMessage";

it("renders correctly", () => {
  const { container } = render(
    <HeroMessage
      title="Test title"
      description="Test description"
      after="test 123"
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});
