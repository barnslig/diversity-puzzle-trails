import * as React from "react";

import useGameId from "../useGameId";

/**
 * A React hook that creates an absolute API url
 *
 * @param path The API URL path, e.g. /parameters
 * @returns The absolute API URL or null if the game id is not available right now
 */
const useApiUrl = (urlGenerator: (gameId: string) => string) => {
  const [gameId] = useGameId();

  return React.useMemo(
    () => (gameId ? urlGenerator(gameId) : null),
    [gameId, urlGenerator]
  );
};

export default useApiUrl;
