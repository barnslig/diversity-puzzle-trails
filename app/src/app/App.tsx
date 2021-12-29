import { CssBaseline } from "@mui/material";
import { IntlProvider } from "react-intl";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import * as React from "react";

import * as messages from "../../lang/de.json";
import theme from "./theme";

import AppRouter from "./AppRouter";
import NotificationProvider from "./NotificationProvider";
import PwaReloadNotification from "./PwaReloadNotification";
import SWRProvider from "./SWRProvider";

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {/* @ts-expect-error */}
        <IntlProvider messages={messages} locale="de" defaultLocale="de">
          <NotificationProvider>
            <SWRProvider>
              <CssBaseline />
              <PwaReloadNotification />
              <AppRouter />
            </SWRProvider>
          </NotificationProvider>
        </IntlProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
