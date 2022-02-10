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
import { Field, FieldProps, Form, Formik, useFormikContext } from "formik";
import * as React from "react";

import useJoinGame from "../../common/hooks/useJoinGame";
import ApiError from "../../common/hooks/api/helper/ApiError";

type StartPageProps = {
  gameId?: string;
};

const AutoSubmitGameId = ({ gameId }: StartPageProps) => {
  const { submitForm } = useFormikContext();

  React.useLayoutEffect(() => {
    if (gameId) {
      // Automatically join the game when a game id is supplied via the url
      submitForm();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

/**
 * Start Code Page to initially set the game ID
 *
 * The game ID is either supplied via the URL or collected from the user using a form.
 */
const StartPage = ({ gameId }: StartPageProps) => {
  const intl = useIntl();
  const joinGame = useJoinGame();

  /**
   * Whether an error has happened during form submission
   */
  const [isErroneous, setIsErroneous] = React.useState(false);

  /**
   * Whether the start page should be visible
   */
  const isVisible = !gameId || isErroneous;

  const onSubmit = React.useCallback(
    async (values, { setFieldError }) => {
      setIsErroneous(false);

      try {
        await joinGame(values.gameId);
      } catch (e) {
        const msg =
          (e as ApiError).info?.errors[0].title || (e as ApiError).message;

        setFieldError("gameId", msg);

        setIsErroneous(true);
      }
    },
    [joinGame]
  );

  return (
    <Box sx={{ visibility: isVisible ? "visible" : "hidden" }}>
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
          <Formik initialValues={{ gameId: gameId || "" }} onSubmit={onSubmit}>
            <Form>
              <Box marginBottom={2}>
                <Typography variant="body1">
                  <FormattedMessage
                    defaultMessage="Um an einem Spiel teilzunehmen ist ein Spiel-Code erforderlich. Bitte tippe diesen hier ein:"
                    description="start code page description"
                  />
                </Typography>
              </Box>

              <Box marginBottom={3}>
                <Field name="gameId">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      id={field.name}
                      label={intl.formatMessage({
                        defaultMessage: "Spiel-Code",
                        description: "start code page game id input label",
                      })}
                      variant="outlined"
                      fullWidth
                      required
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      inputProps={{
                        autoCapitalize: "off",
                        autoComplete: "off",
                        autoCorrect: "off",
                      }}
                      {...field}
                    />
                  )}
                </Field>
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

              <AutoSubmitGameId gameId={gameId} />
            </Form>
          </Formik>
        </Container>
      </Box>
    </Box>
  );
};

export default StartPage;
