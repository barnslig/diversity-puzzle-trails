import { screen } from "@testing-library/react";
import * as React from "react";
import render from "../testing/render";
import type { Workbox, WorkboxEvent } from "workbox-window";

import * as usePwaIsWaiting from "./usePwaIsWaiting";

import usePwaReloadNotification from "./usePwaReloadNotification";
import userEvent from "@testing-library/user-event";

const TestComponent = () => {
  usePwaReloadNotification();
  return null;
};

it("does not show a snackbar when no SW is waiting to be activated", () => {
  jest.spyOn(usePwaIsWaiting, "default").mockReturnValue(false);

  const { container } = render(<TestComponent />);

  expect(
    screen.queryByText(/Neue Inhalte sind verfügbar./)
  ).not.toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot();
});

it("shows a snackbar with an action when a SW is waiting to be activated", () => {
  jest.spyOn(usePwaIsWaiting, "default").mockReturnValue(true);

  const { container } = render(<TestComponent />);

  expect(screen.getByText(/Neue Inhalte sind verfügbar./)).toBeInTheDocument();
  expect(screen.getByText(/Neu laden/)).toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot();
});

it("skips waiting and reloads the page when the user clicks the action button", () => {
  jest.spyOn(usePwaIsWaiting, "default").mockReturnValue(true);

  const location = window.location;
  // @ts-ignore
  delete window.location;
  window.location = {
    ...location,
    reload: jest.fn(),
  };

  const wb = new EventTarget() as unknown as Workbox;
  wb.messageSkipWaiting = jest.fn();
  window.wb = wb;

  render(<TestComponent />);

  userEvent.click(screen.getByText(/Neu laden/));

  expect(wb.messageSkipWaiting).toHaveBeenCalled();

  wb.dispatchEvent(
    new Event("controlling") as unknown as WorkboxEvent<"controlling">
  );

  expect(window.location.reload).toHaveBeenCalled();
});
