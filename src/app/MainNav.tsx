import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  makeStyles,
} from "@material-ui/core";
import { Home } from "@material-ui/icons";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "wouter";
import QrCodeScanner from "../common/icons/QrCodeScanner";

const useStyles = makeStyles((theme) => ({
  bottomNavigation: {
    bottom: 0,
    left: 0,
    position: "fixed",
    width: "100%",
    zIndex: theme.zIndex.appBar,
  },
}));

type MainNavProps = {};

const MainNav = (props: MainNavProps) => {
  const classes = useStyles();
  const [location, setLocation] = useLocation();

  return (
    <Paper elevation={8} component="nav" className={classes.bottomNavigation}>
      <BottomNavigation
        value={location}
        onChange={(ev, value) => value !== location && setLocation(value)}
        showLabels
      >
        <BottomNavigationAction
          value="/"
          label={
            <FormattedMessage
              defaultMessage="Status"
              description="main nav main page item label"
            />
          }
          icon={<Home />}
        />
        <BottomNavigationAction
          value="/scan"
          label={
            <FormattedMessage
              defaultMessage="Scanner"
              description="main nav scanner page item label"
            />
          }
          icon={<QrCodeScanner />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MainNav;
