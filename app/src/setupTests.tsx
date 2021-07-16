import "@testing-library/jest-dom";
import * as React from "react";
import fetch from "node-fetch";

import * as intl from "react-intl";
import * as useGameId from "./common/hooks/useGameId";
import * as useInstanceId from "./common/hooks/useInstanceId";

import { server } from "./mocks/server";

// @ts-expect-error
window.fetch = fetch;

// Mock relative time so tests work at any point in time in the future :)
jest.spyOn(intl, "FormattedRelativeTime").mockReturnValue(<div />);

jest
  .spyOn(useGameId, "default")
  .mockReturnValue(["test-game", () => {}, () => {}]);

jest.spyOn(useInstanceId, "default").mockReturnValue("test-instance");

process.env.API_ROOT = "http://localhost";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
