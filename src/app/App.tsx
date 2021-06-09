import { CssBaseline, makeStyles } from "@material-ui/core";
import { IntlProvider } from "react-intl";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";

import * as messages from "../../lang/de.json";
import AppRouter from "./AppRouter";
import theme from "./theme";

const useStyles = makeStyles((theme) => ({
  snackbarContainerRoot: {
    bottom: theme.spacing(9),
    left: theme.spacing(2),
  },
}));

const App = () => {
  const classes = useStyles();

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
          <AppRouter />
        </SnackbarProvider>
      </IntlProvider>
    </ThemeProvider>
  );
};

export default App;
