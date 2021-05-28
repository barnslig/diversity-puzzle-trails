import {
  AppBar,
  Box,
  Container,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Refresh } from "@material-ui/icons";
import * as React from "react";

import MainNav from "../MainNav";
import Parameters from "../../features/parameters/Parameters";

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
          <IconButton edge="end" color="inherit">
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>
      <MainNav />
      <Box component="main" paddingTop={10} paddingBottom={7}>
        <Container maxWidth="sm">
          <Parameters />
        </Container>
      </Box>
    </div>
  );
};

export default IndexPage;
