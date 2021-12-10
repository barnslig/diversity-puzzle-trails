import { Button } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import * as React from "react";

import usePwaIsWaiting from "./usePwaIsWaiting";

/**
 * A React hook that triggers a notistack notification when a PWA update is available
 */
const usePwaReloadNotification = () => {
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  /**
   * Whether the registered SW is waiting to activate
   */
  const isWaiting = usePwaIsWaiting();

  /**
   * Event handler for when the reload button is clicked by the user
   */
  const onClickReload = React.useCallback(() => {
    if (!window.wb) {
      return;
    }

    window.wb.addEventListener("controlling", (event) => {
      window.location.reload();
    });

    window.wb.messageSkipWaiting();
  }, []);

  React.useEffect(() => {
    if (isWaiting) {
      const action = (
        <Button onClick={onClickReload}>
          <FormattedMessage
            defaultMessage="Neu laden"
            description="pwa reload snackbar action button label"
          />
        </Button>
      );

      enqueueSnackbar(
        intl.formatMessage({
          defaultMessage: "Neue Inhalte sind verfügbar.",
          description: "pwa reload snackbar",
        }),
        {
          action,
          key: "pwa-waiting",
          persist: true,
        }
      );
    }
  }, [enqueueSnackbar, intl, isWaiting, onClickReload]);
};

export default usePwaReloadNotification;
