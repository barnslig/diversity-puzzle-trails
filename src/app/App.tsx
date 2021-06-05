import { CssBaseline, makeStyles } from "@material-ui/core";
import { IntlProvider } from "react-intl";
import { Redirect, Route, Switch } from "wouter";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";

import * as messages from "../../lang/de.json";
import PageLoadingBar from "../common/components/PageLoadingBar";
import theme from "./theme";
import useGameId from "../common/hooks/useGameId";

const CodePage = React.lazy(() => import("./pages/CodePage"));
const IndexPage = React.lazy(() => import("./pages/IndexPage"));
const ScannerPage = React.lazy(() => import("./pages/ScannerPage"));
const StartPage = React.lazy(() => import("./pages/StartPage"));

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

          <React.Suspense fallback={<PageLoadingBar />}>
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
          </React.Suspense>
        </SnackbarProvider>
      </IntlProvider>
    </ThemeProvider>
  );
};

export default App;
