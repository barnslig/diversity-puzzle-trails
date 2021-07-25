import useSWR from "swr";

import { Game } from "../../types/Game";
import ApiError from "./helper/ApiError";
import config from "../../../config";
import errorAwareFetcher from "./helper/errorAwareFetcher";
import useApiUrl from "./useApiUrl";

interface GameApiResponse {
  data: Game;
}

/**
 * A React hook that retrieves the game manifest
 *
 * @returns The game manifest. May be null during initial load
 */
const useGame = () => {
  const url = useApiUrl((gameId) => config.apiEndpoints.game(gameId));
  return useSWR<GameApiResponse, ApiError>(
    () => url,
    (url) => errorAwareFetcher(() => fetch(url))
  );
};

export default useGame;
