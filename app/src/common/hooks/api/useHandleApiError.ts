import { useIntl } from "react-intl";
import { useLocation } from "wouter";
import { useSnackbar } from "notistack";
import * as React from "react";

import ApiError from "./helper/ApiError";
import useCharacter from "../useCharacter";
import useGameId from "../useGameId";

/**
 * A React hook that provides error handling for the ApiError
 *
 * @returns A method that handles an API error
 */
const useHandleApiError = () => {
  const [, , deleteCharacter] = useCharacter();
  const [, , deleteGameId] = useGameId();
  const [, setLocation] = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  return React.useCallback(
    (error?: ApiError) => {
      if (!error) {
        return;
      }

      if (!error.info || error.info.errors.length === 0) {
        /* Show general error when no error info is set. This case only
         * happens when the request completely failed, e.g. by a
         * network error.
         */
        enqueueSnackbar(
          intl.formatMessage({
            defaultMessage: "Ein Fehler ist aufgetreten!",
            description: "unknown error snack",
          }),
          { variant: "error" }
        );

        setLocation("/");

        return;
      }

      const { errors } = error.info;
      for (let i = 0; i < errors.length; i += 1) {
        const err = errors[i];

        /* Reset game when the game ID is unknown and redirect to the
         * join game start page.
         */
        if (err.id === "game-not-found") {
          deleteCharacter();
          deleteGameId();
        }

        enqueueSnackbar(err.title, { variant: "error" });
        setLocation("/");
      }
    },
    [deleteCharacter, deleteGameId, enqueueSnackbar, intl, setLocation]
  );
};

export default useHandleApiError;
