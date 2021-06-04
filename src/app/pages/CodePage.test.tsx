import { SnackbarProvider } from "notistack";
import * as React from "react";

import render from "../../common/testing/render";

import CodePage from "./CodePage";

it("renders correctly", () => {
  const { container } = render(<CodePage codeId="foobar" />);
  expect(container.firstChild).toMatchSnapshot();
});
