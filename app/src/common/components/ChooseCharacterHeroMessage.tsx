import { ArrowDownward } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import * as React from "react";

import HeroMessage from "./HeroMessage";

type ChooseCharacterHeroMessageProps = {};

const ChooseCharacterHeroMessage = (props: ChooseCharacterHeroMessageProps) => {
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
            transform: "translateX(84px)", // TODO remove when the messages nav entry is available
          }}
        />
      }
    />
  );
};

export default ChooseCharacterHeroMessage;
