import { Box, Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import * as React from "react";

import ButtonProgressIndicator from "./ButtonProgressIndicator";
import HeroMessage from "./HeroMessage";
import useUpdateClock from "../hooks/api/useUpdateClock";

const PausedHeroMessage = () => {
  const [isLoading, updateClock] = useUpdateClock();

  return (
    <HeroMessage
      title={
        <FormattedMessage
          defaultMessage="Spiel pausiert"
          description="game paused message title"
        />
      }
      description={
        <FormattedMessage
          defaultMessage="Das Spiel ist pausiert. Du kannst es aber für alle fortsetzen."
          description="game paused message description"
        />
      }
      after={
        <Box marginTop={4} marginBottom={6}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => updateClock("running")}
            disabled={isLoading}
          >
            <FormattedMessage
              defaultMessage="Spiel für alle fortsetzen"
              description="game paused message continue button label"
            />
            {isLoading && <ButtonProgressIndicator />}
          </Button>
        </Box>
      }
    />
  );
};

export default PausedHeroMessage;
