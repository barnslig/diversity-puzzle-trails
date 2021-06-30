import {
  AppBar,
  Box,
  Container,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import * as React from "react";

import ChooseCharacter from "../../common/components/ChooseCharacter";
import MainNav from "../MainNav";
import Parameters from "../../features/parameters/Parameters";
import useCharacter from "../../common/hooks/useCharacter";

const bg = require("./bg.svg");

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${bg})`,
    backgroundAttachment: "fixed",
    backgroundPositionY: theme.spacing(7), // top app bar
  },
  appBarTitle: {
    flexGrow: 1,
  },
}));

type IndexPageProps = {};

const IndexPage = (props: IndexPageProps) => {
  const classes = useStyles();
  const [character] = useCharacter();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Typography
            className={classes.appBarTitle}
            component="h1"
            variant="h6"
          >
            <FormattedMessage
              defaultMessage="Diversity Puzzle Trails"
              description="main page title"
            />
          </Typography>
        </Toolbar>
      </AppBar>
      <MainNav />
      {!character ? (
        <ChooseCharacter />
      ) : (
        <Box component="main" paddingTop={10} paddingBottom={7}>
          <Container maxWidth="sm">
            <Parameters />
          </Container>
        </Box>
      )}
    </div>
  );
};

export default IndexPage;
