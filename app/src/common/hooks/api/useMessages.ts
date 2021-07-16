import useSWR from "swr";

import { Message } from "../../types/Message";
import ApiError from "./helper/ApiError";
import authenticatedFetcher from "./helper/authenticatedFetcher";
import config from "../../../config";
import useApiUrl from "./useApiUrl";
import useInstanceId from "../useInstanceId";

interface MessagesApiResponse {
  data: Message[];
}

/**
 * A React hook that continuously retrieves the global messages
 *
 * @returns The messages. May be null during initial load
 */
const useClock = () => {
  const url = useApiUrl((gameId) => config.apiEndpoints.messages(gameId));
  const instanceId = useInstanceId();

  return useSWR<MessagesApiResponse, ApiError>(
    () => [url, instanceId],
    authenticatedFetcher,
    {
      refreshInterval: 10 * 1000,
    }
  );
};

export default useClock;
