import { SWRConfig } from "swr";
import * as React from "react";

import ApiError from "../common/hooks/api/helper/ApiError";
import useHandleApiError from "../common/hooks/api/useHandleApiError";

type SWRProviderProps = {
  children: React.ReactNode;
};

/**
 * A provider that enables global error handling for SWR hooks
 */
const SWRProvider = ({ children }: SWRProviderProps) => {
  const handleApiError = useHandleApiError();

  const onError = React.useCallback(
    (e: Error) => {
      if (!(e instanceof ApiError)) {
        return;
      }

      handleApiError(e);
    },
    [handleApiError]
  );

  return <SWRConfig value={{ onError }}>{children}</SWRConfig>;
};

export default SWRProvider;
