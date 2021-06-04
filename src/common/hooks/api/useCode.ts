import useSWR from "swr";

import { Code } from "../../types/Code";
import ApiError from "./helper/ApiError";
import authenticatedFetcher from "./helper/authenticatedFetcher";
import pathJoin from "./helper/pathJoin";
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

  return useSWR<CodeApiResponse, ApiError>(
    () => [url, instanceId],
    authenticatedFetcher
  );
};

export default useCode;
