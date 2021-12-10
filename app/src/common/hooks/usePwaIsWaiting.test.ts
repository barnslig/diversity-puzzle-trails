import { act, renderHook } from "@testing-library/react-hooks";

import usePwaIsWaiting from "./usePwaIsWaiting";
import type { Workbox, WorkboxEvent } from "workbox-window";

it("has a sane initial state", () => {
  const { result } = renderHook(() => usePwaIsWaiting());
  expect(result.current).toBeFalsy();
});

it("detects when the registered service worker is waiting to activate", () => {
  const wb = new EventTarget() as unknown as Workbox;
  window.wb = wb;

  const { result } = renderHook(() => usePwaIsWaiting());
  expect(result.current).toBeFalsy();

  act(() => {
    wb.dispatchEvent(
      new Event("waiting") as unknown as WorkboxEvent<"waiting">
    );
  });

  expect(result.current).toBe(true);
});
