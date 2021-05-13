import {
  BottomNavigation,
  BottomNavigationAction,
  CssBaseline,
  makeStyles,
} from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { Route, Switch, useLocation } from "wouter";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";

import store from "./store";
import theme from "./theme";

import * as messages from "./lang/de.json";

import IndexPage from "./pages";
import ScannerPage from "./pages/scanner";
import QrCodeScanner from "../common/icons/QrCodeScanner";

const useStyles = makeStyles((theme) => ({
  bottomNavigation: {
    bottom: 0,
    boxShadow: theme.shadows[8],
    left: 0,
    position: "fixed",
    width: "100%",
  },
  snackbarRoot: {
    marginBottom: theme.spacing(7),
  },
}));

const App = () => {
  const classes = useStyles();
  const [location, setLocation] = useLocation();

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IntlProvider messages={messages} locale="de" defaultLocale="de">
          <SnackbarProvider classes={{ root: classes.snackbarRoot }}>
            <CssBaseline />

            <Switch>
              <Route path="/">
                <IndexPage />
              </Route>
              <Route path="/scan">
                <ScannerPage />
              </Route>
            </Switch>

            <BottomNavigation
              className={classes.bottomNavigation}
              value={location}
              onChange={(ev, value) => value !== location && setLocation(value)}
              showLabels
            >
              <BottomNavigationAction
                value="/"
                label={<FormattedMessage id="navigation.index.label" />}
                icon={<Home />}
              />
              <BottomNavigationAction
                value="/scan"
                label={<FormattedMessage id="navigation.scanner.label" />}
                icon={<QrCodeScanner />}
              />
            </BottomNavigation>
          </SnackbarProvider>
        </IntlProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
