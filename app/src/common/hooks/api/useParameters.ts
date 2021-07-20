import * as React from "react";
import useSWR from "swr";

import { Parameter, ParameterScope } from "../../types/Parameter";
import ApiError from "./helper/ApiError";
import authenticatedFetcher from "./helper/authenticatedFetcher";
import config from "../../../config";
import useApiUrl from "./useApiUrl";
import useInstanceId from "../useInstanceId";

interface ParameterApiResponse {
  data: Parameter[];
}

/**
 * A React hook that returns the game parameters, with auto-refresh
 *
 * @returns The parameters, filtered by the scope. May be null during initial load
 */
export const useParameters = () => {
  const url = useApiUrl((gameId) => config.apiEndpoints.parameters(gameId));
  const instanceId = useInstanceId();

  return useSWR<ParameterApiResponse, ApiError>(
    () => [url, instanceId],
    authenticatedFetcher,
    {
      refreshInterval: 10 * 1000,
    }
  );
};

/**
 * A React hook that filters a ParameterResponse by its scope
 *
 * @param scope The scope, e.g. "user"
 * @param data The ParameterResponse, e.g. from `useParameters`
 * @returns An array of parameters filtered by the scope
 */
export const useScopedParameterResponse = (
  scope: ParameterScope,
  data?: ParameterApiResponse
) =>
  React.useMemo(
    () =>
      (data?.data || []).filter(
        (param: Parameter) => param.attributes.scope === scope
      ),
    [scope, data]
  );

/**
 * A React hook that tells whether the game is over from a ParameterResponse
 *
 * @param data The ParameterResponse, e.g. from `useParameters`
 * @returns Whether any of the parameters has reached its minimum
 */
export const useIsGameOver = (data?: ParameterApiResponse) => {
  return (
    data &&
    data.data.some(({ attributes }) => attributes.value <= attributes.min)
  );
};
