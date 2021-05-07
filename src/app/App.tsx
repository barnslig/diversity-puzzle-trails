import { CssBaseline } from "@material-ui/core";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { Route } from "wouter";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";

import store from "./store";
import theme from "./theme";

import * as messages from "./lang/de.json";

import IndexPage from "./pages";
import ScannerPage from "./pages/scanner";

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <IntlProvider messages={messages} locale="de" defaultLocale="de">
        <CssBaseline />

        <Route path="/">
          <IndexPage />
        </Route>
        <Route path="/scan">
          <ScannerPage />
        </Route>
      </IntlProvider>
    </ThemeProvider>
  </Provider>
);

export default App;
