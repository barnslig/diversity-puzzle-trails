import * as React from "react";

import errorAwareFetcher from "./helper/errorAwareFetcher";
import useHandleApiError from "./useHandleApiError";
import useInstanceId from "../useInstanceId";

/**
 * A React hook that provides an API call handler, with error and loading state handling
 *
 * @param url The API URL
 * @returns An Array with the loading state at pos 0 and the api call method at pos 1
 */
const useCallApi = (
  url: string | null
): [boolean, (reqInit?: RequestInit) => Promise<Response>] => {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleError = useHandleApiError();
  const instanceId = useInstanceId();

  /**
   * @param reqInit Additional Fetch API options
   */
  const callApi = async (reqInit?: RequestInit) => {
    if (!url) {
      return;
    }

    setIsLoading(true);

    try {
      return await errorAwareFetcher(() =>
        fetch(url, {
          ...reqInit,
          headers: {
            Authorization: `Bearer ${instanceId}`,
            ...reqInit?.headers,
          },
        })
      );
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [isLoading, callApi];
};

export default useCallApi;
