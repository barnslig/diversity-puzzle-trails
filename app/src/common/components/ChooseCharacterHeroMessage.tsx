import { ArrowDownward } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import * as React from "react";

import config from "../../config";
import HeroMessage from "./HeroMessage";
import useGame from "../hooks/api/useGame";

type ChooseCharacterHeroMessageProps = {};

const ChooseCharacterHeroMessage = (props: ChooseCharacterHeroMessageProps) => {
  const { data: game } = useGame();

  const hasMessages =
    config.featureMessages && game && game.data.attributes.hasMessages;

  return (
    <HeroMessage
      title={
        <FormattedMessage
          defaultMessage="Charakter wählen"
          description="onboarding choose character headline"
        />
      }
      description={
        <FormattedMessage
          defaultMessage="Scanne eine Charakterkarte um am Spiel teilzunehmen. Dein gewählter Charakter gibt dir bei jeder Aktion im Spiel einen Bonus!"
          description="onboarding choose character paragraph"
        />
      }
      after={
        <ArrowDownward
          sx={{
            marginBottom: 3,
            marginTop: 3,
            transform: hasMessages ? "" : "translateX(84px)",
          }}
        />
      }
    />
  );
};

export default ChooseCharacterHeroMessage;
