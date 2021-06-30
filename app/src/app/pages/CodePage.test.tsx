import { rest } from "msw";
import { waitFor, screen } from "@testing-library/react";
import * as React from "react";
import userEvent from "@testing-library/user-event";

import { server } from "../../mocks/server";
import render from "../../common/testing/render";

import CodePage from "./CodePage";

it("renders correctly", () => {
  const { container } = render(<CodePage codeId="test-code" />);
  expect(container.firstChild).toMatchSnapshot();
});

it("loads a code", async () => {
  const { container } = render(<CodePage codeId="test-code" />);

  await waitFor(() => screen.getByText(/Bewegungspunkte/));
  expect(container.firstChild).toMatchSnapshot();
});

it("shows an error when the code is not found", async () => {
  render(<CodePage codeId="not-found" />);

  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent("Unbekannter QR-Code.");
});

it("shows an error when the code is alread used", async () => {
  render(<CodePage codeId="already-used" />);

  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Der QR-Code wurde bereits verwendet!"
  );
});

it("shows an error when something unexpected happens", async () => {
  server.use(
    rest.get("/games/:gameId/codes/:codeId", (req, res, ctx) =>
      res.networkError("Failed to connect")
    )
  );

  render(<CodePage codeId="already-used" />);

  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Ein Fehler ist aufgetreten!"
  );
});

it("executes a code", async () => {
  const { container } = render(<CodePage codeId="test-code" />);

  // Submit button is initially disabled until we have loaded the qr code
  expect(screen.getByText(/Ausführen/).closest("button")).toBeDisabled();
  expect(container.firstChild).toMatchSnapshot();

  // Wait for the qr code to load
  await waitFor(() => screen.getByText(/Bewegungspunkte/));
  expect(container.firstChild).toMatchSnapshot();

  // Submit the qr code
  userEvent.click(screen.getByText(/Ausführen/));

  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "QR-Code erfolgreich ausgeführt!"
  );
});

it("shows an error when code execution fails", async () => {
  render(<CodePage codeId="test-code" />);

  await waitFor(() => screen.getByText(/Bewegungspunkte/));

  server.use(
    rest.post("/games/:gameId/codes/:codeId", (req, res, ctx) =>
      res.networkError("Failed to connect")
    )
  );

  userEvent.click(screen.getByText(/Ausführen/));

  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Ein Fehler ist aufgetreten!"
  );
});
