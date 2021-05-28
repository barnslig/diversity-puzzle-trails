import { SnackbarProvider } from "notistack";
import * as React from "react";

import renderWithIntl from "../../common/testing/renderWithIntl";

import CodePage from "./CodePage";

it("renders correctly", () => {
  const { container } = renderWithIntl(
    <SnackbarProvider>
      <CodePage codeId="foobar" />
    </SnackbarProvider>
  );
  expect(container.firstChild).toMatchSnapshot();
});
