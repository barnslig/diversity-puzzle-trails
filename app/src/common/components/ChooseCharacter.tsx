import { ArrowDownward } from "@material-ui/icons";
import { Box, Container, makeStyles, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import * as React from "react";

const useStyle = makeStyles((theme) => ({
  root: {
    bottom: 0,
    left: 0,
    paddingBottom: theme.spacing(7),
    paddingTop: theme.spacing(10),
    position: "absolute",
    textAlign: "center",
    width: "100%",
  },
  arrow: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    transform: "translateX(84px)", // TODO remove when the messages nav entry is available
  },
}));

type ChooseCharacterProps = {};

const ChooseCharacter = ({}: ChooseCharacterProps) => {
  const classes = useStyle();

  return (
    <Box component="main" className={classes.root}>
      <Container maxWidth="sm">
        <Typography variant="h5" component="h2" gutterBottom>
          <FormattedMessage
            defaultMessage="Charakter wählen"
            description="onboarding choose character headline"
          />
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <FormattedMessage
            defaultMessage="Scanne eine Charakterkarte um am Spiel teilzunehmen. Dein gewählter Charakter gibt dir bei jeder Aktion im Spiel einen Bonus!"
            description="onboarding choose character paragraph"
          />
        </Typography>
        <ArrowDownward className={classes.arrow} />
      </Container>
    </Box>
  );
};

export default ChooseCharacter;
