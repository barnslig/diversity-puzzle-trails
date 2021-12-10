import * as React from "react";

/**
 * A React hook that returns whether the registered SW is waiting
 *
 * @returns Whether the registered SW has been installed but is waiting to activate
 */
const usePwaIsWaiting = () => {
  /**
   * Whether the registered SW is waiting
   */
  const [isWaiting, setIsWaiting] = React.useState(window.swIsWaiting);

  React.useEffect(() => {
    if (!window.wb) {
      return;
    }

    /**
     * A local reference to the workbox instance
     */
    const wb = window.wb;

    /**
     * Event handler for when the SW is waiting
     */
    const onIsWaiting = () => {
      setIsWaiting(true);
    };

    wb.addEventListener("waiting", onIsWaiting);

    return () => {
      wb.removeEventListener("waiting", onIsWaiting);
    };
  }, []);

  return isWaiting;
};

export default usePwaIsWaiting;
