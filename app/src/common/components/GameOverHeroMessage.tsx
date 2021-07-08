import * as React from "react";
import { FormattedMessage } from "react-intl";
import HeroMessage from "./HeroMessage";

const GameOverHeroMessage = () => {
  return (
    <HeroMessage
      title={
        <FormattedMessage
          defaultMessage="Game Over"
          description="game over headline"
        />
      }
      description={
        <FormattedMessage
          defaultMessage="Ein Parameter hat null erreicht, weshalb das Spiel verloren ist!"
          description="game over copy"
        />
      }
    />
  );
};

export default GameOverHeroMessage;
