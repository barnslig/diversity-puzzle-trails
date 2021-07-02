import { render } from "@testing-library/react";
import * as React from "react";

import ButtonProgressIndicator from "./ButtonProgressIndicator";

it("renders correctly", () => {
  const { container } = render(<ButtonProgressIndicator />);
  expect(container.firstChild).toMatchSnapshot();
});
