import { FormattedMessage } from "react-intl";
import * as React from "react";

import HeroMessage from "./HeroMessage";

const PausedHeroMessage = () => (
  <HeroMessage
    title={
      <FormattedMessage
        defaultMessage="Spiel pausiert"
        description="game paused message title"
      />
    }
  />
);

export default PausedHeroMessage;
