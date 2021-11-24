import {
  AppBar,
  Box,
  Button,
  Container,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";
import * as React from "react";

import useJoinGame from "../../common/hooks/useJoinGame";

type StartPageProps = {
  gameId?: string;
};

/**
 * Start Code Page to initially set the game ID
 *
 * The game ID is either supplied via the URL or collected from the user using a form.
 */
const StartPage = ({ gameId }: StartPageProps) => {
  const intl = useIntl();
  const joinGame = useJoinGame();

  React.useEffect(() => {
    if (gameId) {
      // Automatically join the game when a game id is supplied via the url
      joinGame(gameId);
    }

    // This hook should only be executed once during mount, thus empty deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      gameId: gameId || "",
    },
    onSubmit: (values) => {
      joinGame(values.gameId);
    },
  });

  return gameId ? null : (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography component="h1" sx={{ flexGrow: 1 }} variant="h6">
            <FormattedMessage
              defaultMessage="An einem Spiel teilnehmen"
              description="start code page title"
            />
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" paddingTop={10}>
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box marginBottom={2}>
              <Typography variant="body1">
                <FormattedMessage
                  defaultMessage="Um an einem Spiel teilzunehmen ist ein Spiel-Code erforderlich. Bitte tippe diesen hier ein:"
                  description="start code page description"
                />
              </Typography>
            </Box>

            <Box marginBottom={3}>
              <TextField
                label={intl.formatMessage({
                  defaultMessage: "Spiel-Code",
                  description: "start code page game id input label",
                })}
                variant="outlined"
                fullWidth
                required
                id="gameId"
                name="gameId"
                value={formik.values.gameId}
                onChange={formik.handleChange}
                error={formik.touched.gameId && Boolean(formik.errors.gameId)}
                helperText={formik.touched.gameId && formik.errors.gameId}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Button
                color="primary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                <FormattedMessage
                  defaultMessage="Am Spiel teilnehmen"
                  description="start code page submit button"
                />
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </div>
  );
};

export default StartPage;
