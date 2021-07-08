import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import * as React from "react";
import render from "../testing/render";

import QrCode from "./QrCode";

it("renders correctly", async () => {
  const { container } = render(<QrCode contents="foobar" />);
  expect(container.firstChild).toMatchSnapshot();

  await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
  expect(container.firstChild).toMatchSnapshot();
});
