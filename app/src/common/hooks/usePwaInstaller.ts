import * as React from "react";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

/**
 * A React hook to trigger the PWA installation prompt
 */
const usePwaInstaller = () => {
  /**
   * Whether the PWA is already installed
   */
  const [isInstalled, setIsInstalled] = React.useState(false);

  /**
   * The deferred prompt that is used to trigger PWA installation
   */
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);

  React.useEffect(() => {
    const onAppInstalled = () => setIsInstalled(true);

    const onBeforeInstallPrompt = (e: BeforeInstallPromptEvent) =>
      setDeferredPrompt(e);

    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  /**
   * Whether the PWA can be installed
   */
  const canInstall = !isInstalled && deferredPrompt !== null;

  /**
   * Method to trigger PWA installation
   */
  const triggerInstall = React.useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return {
    /**
     * Whether the PWA can be installed
     */
    canInstall,

    /**
     * Function that triggers the PWA installation prompt
     */
    triggerInstall,
  };
};

export default usePwaInstaller;
