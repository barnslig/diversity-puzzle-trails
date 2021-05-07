import { render } from "@testing-library/react";
import * as React from "react";

import QrCode from "./QrCode";

it("renders correctly", () => {
  const { container } = render(<QrCode contents="foobar" />);
  expect(container.firstChild).toMatchSnapshot();
});
