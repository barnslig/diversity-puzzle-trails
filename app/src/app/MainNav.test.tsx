import { screen } from "@testing-library/react";
import * as React from "react";
import userEvent from "@testing-library/user-event";

import config from "../config";
import MainNav from "./MainNav";
import render from "../common/testing/render";

it("renders correctly", () => {
  const { container } = render(<MainNav />);
  expect(container.firstChild).toMatchSnapshot();
});

it("sets the location on click", () => {
  render(<MainNav />);

  expect(window.location.pathname).toEqual("/");

  if (config.featureMessages) {
    userEvent.click(screen.getByText(/Nachrichten/));
    expect(window.location.pathname).toEqual("/messages");
  }

  userEvent.click(screen.getByText(/Scanner/));
  expect(window.location.pathname).toEqual("/scan");

  userEvent.click(screen.getByText(/Status/));
  expect(window.location.pathname).toEqual("/");
});
