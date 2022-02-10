import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Highlight } from "@mui/icons-material";
import { Result } from "@zxing/library";
import { useLocation } from "wouter";
import { useSnackbar } from "notistack";
import * as React from "react";

import MainNav from "../MainNav";
import QRCodeReader from "../../common/components/QRCodeReader";

import config from "../../config";

type ScannerPageProps = {};

const ScannerPage = (props: ScannerPageProps) => {
  // @ts-ignore
  const torchAvailable = navigator.mediaDevices.getSupportedConstraints().torch;
  const [torch, setTorch] = React.useState<boolean>(false);

  const [, setLocation] = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const intl = useIntl();

  const onResult = (result: Result) => {
    let resUrl;
    try {
      resUrl = new URL(result.getText());
    } catch (error) {}

    if (
      !resUrl ||
      !config.allowedCodeOrigins.includes(resUrl.origin) ||
      !/^\/code\/.+$/.test(resUrl.pathname)
    ) {
      enqueueSnackbar(
        intl.formatMessage({
          defaultMessage: "Ungültiger QR-Code!",
          description: "error on invalid qr code",
        }),
        {
          key: "invalid-qr",
          preventDuplicate: true,
          variant: "error",
        }
      );
    } else {
      closeSnackbar("invalid-qr");
      setLocation(resUrl.pathname);
    }
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography component="h1" sx={{ flexGrow: 1 }} variant="h6">
            <FormattedMessage
              defaultMessage="QR-Code scannen"
              description="scanner page title"
            />
          </Typography>
          {torchAvailable && (
            <IconButton
              aria-label={intl.formatMessage(
                {
                  defaultMessage:
                    "Taschenlampe {state, select, true {ausschalten} other {einschalten}}",
                  description: "scanner page toggle torch",
                },
                { state: torch }
              )}
              edge="end"
              color="inherit"
              onClick={() => setTorch(!torch)}
              size="large"
            >
              <Highlight />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <MainNav />
      <Box component="main">
        <QRCodeReader torch={torch} onResult={onResult} />
      </Box>
    </div>
  );
};

export default ScannerPage;
