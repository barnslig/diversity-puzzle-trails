import useSWR from "swr";

import { Clock } from "../../types/Clock";
import ApiError from "./helper/ApiError";
import authenticatedFetcher from "./helper/authenticatedFetcher";
import config from "../../../config";
import useApiUrl from "./useApiUrl";
import useInstanceId from "../useInstanceId";

interface ClockApiResponse {
  data: Clock;
}

/**
 * A React hook that continuously retrieves the global game clock's state
 *
 * @returns The game clock. May be null during initial load
 */
const useClock = () => {
  const url = useApiUrl((gameId) => config.apiEndpoints.clock(gameId));
  const instanceId = useInstanceId();

  return useSWR<ClockApiResponse, ApiError>(
    () => [url, instanceId],
    authenticatedFetcher,
    {
      refreshInterval: 10 * 1000,
    }
  );
};

export default useClock;
