import {
  AppBar,
  Box,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { Highlight } from "@material-ui/icons";
import { Result } from "@zxing/library";
import { useSnackbar } from "notistack";
import * as React from "react";

import MainNav from "../MainNav";
import QRCodeReader from "../../common/components/QRCodeReader";
import { useLocation } from "wouter";

const useStyles = makeStyles((theme) => ({
  appBarTitle: {
    flexGrow: 1,
  },
}));

type ScannerPageProps = {};

const ScannerPage = (props: ScannerPageProps) => {
  const classes = useStyles();

  const [result, setResult] = React.useState<Result | null>(null);

  // @ts-ignore
  const torchAvailable = navigator.mediaDevices.getSupportedConstraints().torch;
  const [torch, setTorch] = React.useState<boolean>(false);

  const [, setLocation] = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  const onResult = (result: Result) => {
    const resUrl = new URL(result.getText());

    if (
      resUrl.origin !== window.location.origin ||
      !/^\/code\/\w+$/.test(resUrl.pathname)
    ) {
      enqueueSnackbar(
        intl.formatMessage({
          defaultMessage: "Ungültiger QR-Code!",
          description: "error on invalid qr code",
        }),
        {
          preventDuplicate: true,
          variant: "error",
        }
      );
      return;
    }

    setLocation(resUrl.pathname);
  };

  return (
    <div>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Typography
            className={classes.appBarTitle}
            component="h1"
            variant="h6"
          >
            <FormattedMessage
              defaultMessage="QR-Code scannen"
              description="scanner page title"
            />
          </Typography>
          {torchAvailable && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setTorch(!torch)}
            >
              <Highlight />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <MainNav />
      <Box component="main">
        {result ? (
          <>
            {JSON.stringify(result.getText())}
            <Button color="primary" onClick={() => setResult(null)}>
              Nochmal scannen
            </Button>
          </>
        ) : (
          <QRCodeReader torch={torch} onResult={onResult} />
        )}
      </Box>
    </div>
  );
};

export default ScannerPage;