import * as React from "react";
import useSWR from "swr";

import { authenticatedFetcher } from "./apiHelper";
import { Parameter, ParameterScope } from "../../types/Parameter";
import useApiUrl from "./useApiUrl";
import useInstanceId from "../useInstanceId";

interface ParameterApiResponse {
  data: Parameter[];
}

/**
 * A React hook that returns the game parameters, with auto-refresh
 *
 * @param scope The parameter scope to return. May be either "global" or "user"
 * @returns The parameters, filtered by the scope. May be null during initial load
 */
export const useParameters = (scope: ParameterScope) => {
  const url = useApiUrl("/parameters");
  const instanceId = useInstanceId();

  const { data } = useSWR<ParameterApiResponse>(
    () => [url, instanceId],
    authenticatedFetcher,
    {
      refreshInterval: 10 * 1000,
    }
  );

  const parameters = data?.data || [];

  return React.useMemo(
    () =>
      parameters.filter((param: Parameter) => param.attributes.scope === scope),
    [parameters]
  );
};

/**
 * A React hook that returns the user's game parameters, with auto-refresh
 *
 * @returns The user's parameters
 */
export const useUserParameters = () => useParameters("user");

/**
 * A React hook that returns the global game parameters, with auto-refresh
 *
 * @param gameId The game ID
 * @returns The global parameters
 */
export const useGlobalParameters = () => useParameters("global");
