import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useLocation } from "wouter";
import * as React from "react";

import Code from "../../features/code/Code";
import useCode from "../../common/hooks/api/useCode";
import useApiUrl from "../../common/hooks/api/useApiUrl";
import { pathJoin } from "../../common/hooks/api/apiHelper";
import useInstanceId from "../../common/hooks/useInstanceId";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  appBarTitle: {
    flexGrow: 1,
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

type CodePageProps = {
  codeId: string;
};

const CodePage = ({ codeId }: CodePageProps) => {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const code = useCode(codeId);
  const instanceId = useInstanceId();
  const intl = useIntl();
  const url = useApiUrl(pathJoin("/codes", codeId));

  const onSubmit = async () => {
    if (!url) {
      return;
    }

    setIsLoading(true);

    // TODO error handling
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${instanceId}`,
      },
    });

    enqueueSnackbar(
      intl.formatMessage({
        defaultMessage: "QR-Code erfolgreich ausgeführt!",
        description: "success snack on exec qr code",
      }),
      { variant: "success" }
    );

    setLocation("/");
  };

  return (
    <div>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Box marginRight={2}>
            <Link href="/">
              <IconButton
                edge="start"
                title={intl.formatMessage({
                  defaultMessage: "QR-Code nicht ausführen",
                  description:
                    "app bar close button of the confirm qr code action page",
                })}
              >
                <Close />
              </IconButton>
            </Link>
          </Box>
          <Typography
            className={classes.appBarTitle}
            component="h1"
            variant="h6"
          >
            <FormattedMessage
              defaultMessage="QR-Code Aktionen"
              description="title of the confirm qr code actions page"
            />
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" paddingTop={10} paddingBottom={7}>
        <Container maxWidth="sm">
          <Typography gutterBottom variant="body1">
            <FormattedMessage
              defaultMessage="Dieser QR-Code führt folgende Aktionen aus:"
              description="body of the card to confirm a qr-code"
            />
          </Typography>

          <Box marginBottom={3}>
            <Code code={code} />
          </Box>

          {code && (
            <Button
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={isLoading}
              onClick={onSubmit}
            >
              <FormattedMessage
                defaultMessage="Ausführen"
                description="confirm qr code button"
              />
              {isLoading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </Button>
          )}
        </Container>
      </Box>
    </div>
  );
};

export default CodePage;
