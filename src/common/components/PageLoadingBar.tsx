import * as React from "react";
import ProgressBar from "@badrap/bar-of-progress";

/**
 * A page loading bar used during router navigation
 */
const PageLoadingBar = () => {
  React.useEffect(() => {
    const progress = new ProgressBar();
    progress.start();

    return () => progress.finish();
  }, []);

  return null;
};

export default PageLoadingBar;
