import { CssBaseline, makeStyles } from "@material-ui/core";
import { IntlProvider } from "react-intl";
import { Redirect, Route, Switch } from "wouter";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";

import theme from "./theme";

import * as messages from "../../lang/de.json";

import useGameId from "../common/hooks/useGameId";

import CodePage from "./pages/CodePage";
import IndexPage from "./pages/IndexPage";
import ScannerPage from "./pages/ScannerPage";
import StartPage from "./pages/StartPage";

const useStyles = makeStyles((theme) => ({
  snackbarContainerRoot: {
    bottom: theme.spacing(9),
    left: theme.spacing(2),
  },
}));

const App = () => {
  const classes = useStyles();
  const [gameId] = useGameId();

  return (
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
              {gameId ? <IndexPage /> : <Redirect to="/start" />}
            </Route>
            <Route path="/scan">
              {gameId ? <ScannerPage /> : <Redirect to="/start" />}
            </Route>
            <Route path="/code/:codeId">
              {gameId ? (
                ({ codeId }) => <CodePage codeId={codeId} />
              ) : (
                <Redirect to="/start" />
              )}
            </Route>
            <Route path="/start/:gameId?">
              {({ gameId }) => <StartPage gameId={gameId} />}
            </Route>
          </Switch>
        </SnackbarProvider>
      </IntlProvider>
    </ThemeProvider>
  );
};

export default App;
