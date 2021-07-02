import { ArrowDownward } from "@material-ui/icons";
import { FormattedMessage } from "react-intl";
import { makeStyles } from "@material-ui/core";
import * as React from "react";

import HeroMessage from "./HeroMessage";

const useStyle = makeStyles((theme) => ({
  arrow: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    transform: "translateX(84px)", // TODO remove when the messages nav entry is available
  },
}));

type ChooseCharacterHeroMessageProps = {};

const ChooseCharacterHeroMessage = ({}: ChooseCharacterHeroMessageProps) => {
  const classes = useStyle();

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
      after={<ArrowDownward className={classes.arrow} />}
    />
  );
};

export default ChooseCharacterHeroMessage;
