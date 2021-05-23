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

import * as messages from "../../lang/de.json";

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
  snackbarContainerRoot: {
    bottom: theme.spacing(9),
  },
}));

const App = () => {
  const classes = useStyles();
  const [location, setLocation] = useLocation();

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* @ts-expect-error */}
        <IntlProvider messages={messages} locale="de" defaultLocale="de">
          <SnackbarProvider
            classes={{ containerRoot: classes.snackbarContainerRoot }}
            hideIconVariant
            maxSnack={1}
          >
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
          </SnackbarProvider>
        </IntlProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
