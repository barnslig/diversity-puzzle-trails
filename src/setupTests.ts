import "@testing-library/jest-dom";
import { cache } from "swr";
import fetch from "node-fetch";

import * as useGameId from "./common/hooks/useGameId";
import * as useInstanceId from "./common/hooks/useInstanceId";

import { server } from "./mocks/server";

// @ts-expect-error
window.fetch = fetch;

jest
  .spyOn(useGameId, "default")
  .mockReturnValue(["test-game", () => {}, () => {}]);

jest.spyOn(useInstanceId, "default").mockReturnValue("test-instance");

process.env.API_ROOT = "http://localhost";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

afterEach(() => cache.clear());
