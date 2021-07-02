import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "wouter";
import * as React from "react";

import ButtonProgressIndicator from "../../common/components/ButtonProgressIndicator";
import Code from "../../features/code/Code";
import StickyActionButtons from "../../common/components/StickyActionButtons";
import useCode from "../../common/hooks/api/useCode";
import useHandleApiError from "../../common/hooks/api/useHandleApiError";
import useSubmitCode from "../../common/hooks/api/useSubmitCode";

const useStyles = makeStyles((theme) => ({
  appBarTitle: {
    flexGrow: 1,
  },
}));

type CodePageProps = {
  codeId: string;
};

const CodePage = ({ codeId }: CodePageProps) => {
  const { data, error } = useCode(codeId);
  const classes = useStyles();
  const intl = useIntl();
  const [isLoading, submitCode] = useSubmitCode(codeId);

  const code = data?.data;

  const handleError = useHandleApiError();
  React.useEffect(() => handleError(error), [error]);

  const onSubmit = () => {
    if (!code) {
      return;
    }
    return submitCode(code);
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
              {isLoading && <ButtonProgressIndicator />}
            </Button>
          </StickyActionButtons>
        </Container>
      </Box>
    </div>
  );
};

export default CodePage;
