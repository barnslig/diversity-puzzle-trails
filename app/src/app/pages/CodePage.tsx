import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "wouter";
import * as React from "react";

import ButtonProgressIndicator from "../../common/components/ButtonProgressIndicator";
import Code from "../../features/code/Code";
import StickyActionButtons from "../../common/components/StickyActionButtons";
import useCode from "../../common/hooks/api/useCode";
import useSubmitCode from "../../common/hooks/api/useSubmitCode";

type CodePageProps = {
  codeId: string;
};

const CodePage = ({ codeId }: CodePageProps) => {
  const { data } = useCode(codeId);
  const intl = useIntl();
  const [isLoading, submitCode] = useSubmitCode(codeId);

  const code = data?.data;

  const onSubmit = () => {
    if (!code) {
      return;
    }
    return submitCode(code);
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Box marginRight={2}>
            <Link href="/">
              <IconButton
                color="inherit"
                edge="start"
                title={intl.formatMessage({
                  defaultMessage: "QR-Code nicht ausführen",
                  description:
                    "app bar close button of the confirm qr code action page",
                })}
                size="large"
              >
                <Close />
              </IconButton>
            </Link>
          </Box>
          <Typography component="h1" sx={{ flexGrow: 1 }} variant="h6">
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
