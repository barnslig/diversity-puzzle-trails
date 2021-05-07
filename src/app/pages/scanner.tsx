import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack, Highlight } from "@material-ui/icons";
import { FormattedMessage } from "react-intl";
import { Link } from "wouter";
import { Result } from "@zxing/library";
import * as React from "react";

import QRCodeReader from "../../common/components/QRCodeReader";

const useStyles = makeStyles((theme) => ({
  appBarBack: {
    marginRight: theme.spacing(2),
  },
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

  return (
    <>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <Link href="/">
            <IconButton
              className={classes.appBarBack}
              edge="start"
              color="inherit"
            >
              <ArrowBack />
            </IconButton>
          </Link>
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
          <QRCodeReader torch={torch} onResult={setResult} />
        )}
      </main>
    </>
  );
};

export default ScannerPage;
