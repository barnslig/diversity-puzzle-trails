import { CssBaseline, makeStyles } from "@material-ui/core";
import { IntlProvider } from "react-intl";
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

const useStyles = makeStyles((theme) => ({
  snackbarContainerRoot: {
    bottom: theme.spacing(9),
  },
}));

const App = () => {
  const classes = useStyles();

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
          </SnackbarProvider>
        </IntlProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
