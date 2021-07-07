import { useIntl } from "react-intl";
import { useLocation } from "wouter";
import { useSnackbar } from "notistack";

import ApiError from "./helper/ApiError";

/**
 * A React hook that provides error handling for the ApiError
 *
 * @returns A method that handles an API error
 */
const useHandleApiError = () => {
  const [, setLocation] = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  return (error?: ApiError) => {
    if (!error) {
      return;
    }

    const title = error.info?.errors[0].title;

    enqueueSnackbar(
      title
        ? title
        : intl.formatMessage({
            defaultMessage: "Ein Fehler ist aufgetreten!",
            description: "unknown error snack",
          }),
      { variant: "error" }
    );

    setLocation("/");
  };
};

export default useHandleApiError;
