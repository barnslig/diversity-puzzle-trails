import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useLocation } from "wouter";
import config from "../../../config";
import { Code, CodeAction, CodeActionSetCharacter } from "../../types/Code";
import useCharacter from "../useCharacter";
import useApiUrl from "./useApiUrl";
import useCallApi from "./useCallApi";

/**
 * A React hook that creates a method to submit a game code
 *
 * @returns An array with the loading state at pos 0 and api method at pos 1
 */
const useSubmitCode = (
  codeId: string
): [boolean, (code: Code) => Promise<Response | undefined>] => {
  const [, setCharacter] = useCharacter();
  const [, setLocation] = useLocation();
  const url = useApiUrl((gameId) => config.apiEndpoints.code(codeId, gameId));
  const [isLoading, callApi] = useCallApi(url);
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  const submitCode = async (code: Code) => {
    try {
      const res = await callApi({ method: "POST" });

      /* If the code includes a setCharacter action, set it as currently
       * used character. This is used to control the onboarding screen
       * within IndexPage.tsx
       */
      const setCharacterAction = code.attributes.actions.find(
        ({ type }: CodeAction) => type === "setCharacter"
      ) as CodeActionSetCharacter;
      if (setCharacterAction) {
        setCharacter(setCharacterAction.character);
      }

      enqueueSnackbar(
        intl.formatMessage({
          defaultMessage: "QR-Code erfolgreich ausgeführt!",
          description: "success snack on exec qr code",
        }),
        { variant: "success" }
      );

      setLocation("/");

      return res;
    } catch (err) {}
  };

  return [isLoading, submitCode];
};

export default useSubmitCode;
