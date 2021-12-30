import { useIntl } from "react-intl";
import { useLocation } from "wouter";
import { useSnackbar } from "notistack";
import * as React from "react";

import config from "../../config";
import errorAwareFetcher from "./api/helper/errorAwareFetcher";
import useCharacter from "./useCharacter";
import useGameId from "../../common/hooks/useGameId";

/**
 * A React hook to join a game using a game ID
 *
 * @returns A function to be called with a game ID
 */
const useJoinGame = () => {
  const [, setGameId, deleteGameId] = useGameId();
  const [, setLocation] = useLocation();
  const [, , deleteCharacter] = useCharacter();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  return React.useCallback(
    async (gameId: string) => {
      try {
        // Retrieve the game manifest
        const url = config.apiEndpoints.game(gameId);
        await errorAwareFetcher(() => fetch(url));

        deleteCharacter();
        setGameId(gameId);

        enqueueSnackbar(
          intl.formatMessage({
            defaultMessage: "Du bist jetzt Teil vom Spiel!",
            description: "success snackbar on join game",
          }),
          { variant: "success" }
        );

        setLocation("/");
      } catch (e) {
        deleteCharacter();
        deleteGameId();

        throw e;
      }
    },
    [
      deleteCharacter,
      deleteGameId,
      enqueueSnackbar,
      intl,
      setGameId,
      setLocation,
    ]
  );
};

export default useJoinGame;
