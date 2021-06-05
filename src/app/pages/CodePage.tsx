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
import { useSnackbar } from "notistack";
import * as React from "react";

import ApiError from "../../common/hooks/api/helper/ApiError";
import Code from "../../features/code/Code";
import config from "../../config";
import errorAwareFetcher from "../../common/hooks/api/helper/errorAwareFetcher";
import StickyActionButtons from "../../common/components/StickyActionButtons";
import useApiUrl from "../../common/hooks/api/useApiUrl";
import useCode from "../../common/hooks/api/useCode";
import useInstanceId from "../../common/hooks/useInstanceId";

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
  const { data, error } = useCode(codeId);
  const instanceId = useInstanceId();
  const intl = useIntl();
  const url = useApiUrl((gameId) => config.apiEndpoints.code(codeId, gameId));

  const code = data?.data;

  const handleError = (error?: ApiError) => {
    if (!error) {
      return;
    }

    const title = error.info?.errors[0].title;

    enqueueSnackbar(
      title
        ? title
        : intl.formatMessage({
            defaultMessage: "Ein Fehler ist aufgetreten!",
            description: "unknown error snack",
          }),
      { variant: "error" }
    );

    setLocation("/");
  };

  React.useEffect(() => handleError(error), [error]);

  const onSubmit = async () => {
    if (!url) {
      return;
    }

    setIsLoading(true);

    try {
      await errorAwareFetcher(() =>
        fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${instanceId}`,
          },
        })
      );
    } catch (error) {
      return handleError(error);
    }

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
      <Box component="main" paddingTop={10}>
        <Container maxWidth="sm">
          <Typography gutterBottom variant="body1">
            <FormattedMessage
              defaultMessage="Dieser QR-Code führt folgende Aktionen aus:"
              description="body of the card to confirm a qr-code"
            />
          </Typography>

          <Code code={code} />

          <StickyActionButtons>
            <Button
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={!code || isLoading}
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
          </StickyActionButtons>
        </Container>
      </Box>
    </div>
  );
};

export default CodePage;
