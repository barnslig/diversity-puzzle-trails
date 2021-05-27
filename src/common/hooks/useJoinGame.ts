import { useIntl } from "react-intl";
import { useLocation } from "wouter";
import { useSnackbar } from "notistack";

import useGameId from "../../common/hooks/useGameId";

/**
 * A React hook to join a game using a game ID
 *
 * @returns A function to be called with a game ID
 */
const useJoinGame = () => {
  const [, setGameId] = useGameId();
  const [, setLocation] = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  return (gameId: string) => {
    setGameId(gameId);
    enqueueSnackbar(
      intl.formatMessage({
        defaultMessage: "Du bist jetzt Teil vom Spiel!",
        description: "success snackbar on join game",
      }),
      { variant: "success" }
    );
    setLocation("/");
  };
};

export default useJoinGame;
