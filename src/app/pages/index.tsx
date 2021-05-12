import {
  AppBar,
  Container,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Refresh } from "@material-ui/icons";
import * as React from "react";

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
  main: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(8), // add enough bottom space to see content behind the floating action button
  },
}));

type IndexPageProps = {};

const IndexPage = (props: IndexPageProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <Typography
            className={classes.appBarTitle}
            component="h1"
            variant="h6"
          >
            <FormattedMessage id="pages.index.title" />
          </Typography>
          <IconButton edge="end" color="inherit">
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <Container maxWidth="sm">
          <Parameters />
        </Container>
      </main>
    </div>
  );
};

export default IndexPage;
