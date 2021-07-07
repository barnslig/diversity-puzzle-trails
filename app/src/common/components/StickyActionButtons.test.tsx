import { render } from "@testing-library/react";
import * as React from "react";

import StickyActionButtons from "./StickyActionButtons";

it("renders correctly", () => {
  const { container } = render(
    <StickyActionButtons>
      <div />
    </StickyActionButtons>
  );
  expect(container.firstChild).toMatchSnapshot();
});
