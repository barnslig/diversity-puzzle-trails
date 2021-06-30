import { screen, waitFor } from "@testing-library/react";
import * as React from "react";
import * as useCharacter from "../../common/hooks/useCharacter";
import render from "../../common/testing/render";

import IndexPage from "./IndexPage";

it("initially asks the user to choose a character", () => {
  const { container } = render(<IndexPage />);

  expect(screen.getByText(/Charakter wählen/)).toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot();
});

it("shows the parameters when a character is set", async () => {
  jest
    .spyOn(useCharacter, "default")
    .mockReturnValueOnce(["engineer", () => {}, () => {}]);

  const { container } = render(<IndexPage />);

  expect(screen.getByText(/Persönliches/)).toBeInTheDocument;
  expect(container.firstChild).toMatchSnapshot();
});
