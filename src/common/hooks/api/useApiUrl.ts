import * as React from "react";

import { pathJoin } from "./apiHelper";
import useGameId from "../useGameId";

import config from "../../../config";

/**
 * A React hook that creates an absolute API url
 *
 * @param path The API URL path, e.g. /parameters
 * @returns The absolute API URL or null if the game id is not available right now
 */
const useApiUrl = (path: string) => {
  const [gameId] = useGameId();

  if (!gameId) {
    return null;
  }

  return React.useMemo(
    () => new URL(pathJoin(config.apiRoot, "games", gameId, path)).href,
    [gameId, path]
  );
};

export default useApiUrl;
