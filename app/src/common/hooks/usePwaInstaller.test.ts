import { renderHook, act } from "@testing-library/react-hooks";
import { fireEvent } from "@testing-library/react";

import usePwaInstaller, { BeforeInstallPromptEvent } from "./usePwaInstaller";

it("has a sane initial state", () => {
  const { result } = renderHook(() => usePwaInstaller());
  expect(result.current.canInstall).toBe(false);
  expect(result.current.triggerInstall()).resolves.toBeUndefined();
});

it("detects whether the app can be installed", () => {
  const { result } = renderHook(() => usePwaInstaller());
  expect(result.current.canInstall).toBe(false);

  fireEvent(window, new Event("beforeinstallprompt"));

  expect(result.current.canInstall).toBe(true);
});

it("detects whether the app is already installed", () => {
  const { result } = renderHook(() => usePwaInstaller());
  expect(result.current.canInstall).toBe(false);

  fireEvent(window, new Event("appinstalled"));

  expect(result.current.canInstall).toBe(false);
});

const createBeforeInstallPromptEvent = (outcome: "accepted" | "dismissed") =>
  new (class extends Event implements BeforeInstallPromptEvent {
    platforms = [];
    userChoice = Promise.resolve<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>({ outcome, platform: "" });
    prompt = jest.fn(async () => {});
  })("beforeinstallprompt");

it("triggers the installation prompt", async () => {
  const { result } = renderHook(() => usePwaInstaller());
  expect(result.current.canInstall).toBe(false);

  const ev = createBeforeInstallPromptEvent("accepted");
  fireEvent(window, ev);

  expect(result.current.canInstall).toBe(true);

  await act(async () => {
    await result.current.triggerInstall();
  });

  expect(ev.prompt).toHaveBeenCalled();
  expect(result.current.canInstall).toBe(false);
});

it("can trigger the install prompt again when the user dismissed it", async () => {
  const { result } = renderHook(() => usePwaInstaller());
  expect(result.current.canInstall).toBe(false);

  const ev = createBeforeInstallPromptEvent("dismissed");
  fireEvent(window, ev);

  expect(result.current.canInstall).toBe(true);

  await act(async () => {
    await result.current.triggerInstall();
  });

  expect(ev.prompt).toHaveBeenCalled();
  expect(result.current.canInstall).toBe(true);

  await act(async () => {
    await result.current.triggerInstall();
  });

  expect(ev.prompt).toHaveBeenCalled();
});
