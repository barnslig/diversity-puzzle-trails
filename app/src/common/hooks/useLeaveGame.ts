import { useIntl } from "react-intl";
import { useLocation } from "wouter";
import { useSnackbar } from "notistack";
import useCharacter from "./useCharacter";
import useGameId from "./useGameId";

/**
 * A React hook to leave the game
 *
 * @returns A function to call in order to leave the game
 */
const useLeaveGame = () => {
  const [, , deleteCharacter] = useCharacter();
  const [, , deleteGameId] = useGameId();
  const [, setLocation] = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  return () => {
    deleteCharacter();
    deleteGameId();
    enqueueSnackbar(
      intl.formatMessage({
        defaultMessage: "Spiel erfolgreich verlassen!",
        description: "success snackbar on leave game",
      }),
      { variant: "success" }
    );
    setLocation("/");
  };
};

export default useLeaveGame;
