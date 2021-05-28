import useSWR from "swr";

import { authenticatedFetcher, pathJoin } from "./apiHelper";
import { Code } from "../../types/Code";
import useApiUrl from "./useApiUrl";
import useInstanceId from "../useInstanceId";

interface CodeApiResponse {
  data: Code;
}

/**
 * A React hook that retrieves a qr code's actions
 *
 * @param codeId The QR code id
 * @returns The code. May be null during initial load
 */
const useCode = (codeId: string) => {
  const url = useApiUrl(pathJoin("/codes", codeId));
  const instanceId = useInstanceId();

  const { data } = useSWR<CodeApiResponse>(
    () => [url, instanceId],
    authenticatedFetcher
  );

  return data?.data;
};

export default useCode;
