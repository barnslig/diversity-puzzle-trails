import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Highlight } from "@material-ui/icons";
import { FormattedMessage } from "react-intl";
import { Result } from "@zxing/library";
import { useSnackbar, OptionsObject } from "notistack";
import * as React from "react";

import QRCodeReader from "../../common/components/QRCodeReader";

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

  const { enqueueSnackbar } = useSnackbar();

  const onResult = (result: Result) => {
    const resUrl = new URL(result.getText());

    const snackOptions: OptionsObject = {
      preventDuplicate: true,
      variant: "error",
    };

    if (resUrl.origin !== window.location.origin) {
      enqueueSnackbar("Invalid QR: Wrong origin", snackOptions);
      return;
    }

    if (resUrl.pathname !== "/code") {
      enqueueSnackbar("Invalid QR: Wrong pathname", snackOptions);
      return;
    }

    setResult(result);
  };

  return (
    <>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Typography
            className={classes.appBarTitle}
            component="h1"
            variant="h6"
          >
            <FormattedMessage id="pages.scanner.title" />
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
      <main>
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
      </main>
    </>
  );
};

export default ScannerPage;
