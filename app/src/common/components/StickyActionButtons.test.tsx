import * as React from "react";
import render from "../testing/render";

import StickyActionButtons from "./StickyActionButtons";

it("renders correctly", () => {
  const { container } = render(
    <StickyActionButtons>
      <div />
    </StickyActionButtons>
  );
  expect(container.firstChild).toMatchSnapshot();
});
