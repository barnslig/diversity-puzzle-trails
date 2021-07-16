import {
  AppBar,
  Box,
  Container,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { FormattedMessage, useIntl } from "react-intl";
import * as React from "react";

import {
  useParameters,
  useIsGameOver,
} from "../../common/hooks/api/useParameters";
import ButtonProgressIndicator from "../../common/components/ButtonProgressIndicator";
import ChooseCharacterHeroMessage from "../../common/components/ChooseCharacterHeroMessage";
import GameOverHeroMessage from "../../common/components/GameOverHeroMessage";
import MainNav from "../MainNav";
import Parameters from "../../features/parameters/Parameters";
import PausedHeroMessage from "../../common/components/PausedHeroMessage";
import useCharacter from "../../common/hooks/useCharacter";
import useClock from "../../common/hooks/api/useClock";
import useUpdateClock from "../../common/hooks/api/useUpdateClock";
import useLeaveGame from "../../common/hooks/useLeaveGame";

const bg = require("./bg.svg");

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${bg})`,
    backgroundAttachment: "fixed",
    backgroundPositionY: theme.spacing(7), // top app bar
  },
  appBarTitle: {
    flexGrow: 1,
  },
}));

type IndexPageProps = {};

const IndexPage = (props: IndexPageProps) => {
  const classes = useStyles();
  const intl = useIntl();

  const [character] = useCharacter();

  const clock = useClock();
  const isPaused = clock.data?.data.attributes.state === "paused";

  const parameters = useParameters();
  const isGameOver = useIsGameOver(parameters?.data);

  const appBarMenuAnchorEl = React.useRef<HTMLButtonElement>(null);
  const [appBarMenuIsOpen, setAppBarMenuIsOpen] = React.useState(false);
  const [updateClockIsLoading, updateClock] = useUpdateClock();

  const leaveGame = useLeaveGame();
  const onLeaveGame = () => {
    if (
      window.confirm(
        intl.formatMessage({
          defaultMessage: "Spiel wirklich verlassen?",
          description: "leave game confirm message",
        })
      )
    ) {
      leaveGame();
    }
    setAppBarMenuIsOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Typography
            className={classes.appBarTitle}
            component="h1"
            variant="h6"
          >
            <FormattedMessage
              defaultMessage="Diversity Puzzle Trails"
              description="main page title"
            />
          </Typography>
          <IconButton
            ref={appBarMenuAnchorEl}
            aria-label={intl.formatMessage({
              defaultMessage: "Aktionen anzeigen",
              description: "appbar menu toggle",
            })}
            aria-controls="menu-appbar"
            aria-haspopup="true"
            edge="end"
            color="inherit"
            onClick={() => {
              setAppBarMenuIsOpen(!appBarMenuIsOpen);
            }}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={appBarMenuAnchorEl.current}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={appBarMenuIsOpen}
            onClose={() => setAppBarMenuIsOpen(false)}
          >
            {isPaused ? (
              <MenuItem
                disabled={updateClockIsLoading}
                onClick={async () => {
                  await updateClock("running");
                  setAppBarMenuIsOpen(false);
                }}
              >
                <FormattedMessage
                  defaultMessage="Spiel für alle fortsetzen"
                  description="appbar menu item continue game"
                />
                {updateClockIsLoading && <ButtonProgressIndicator />}
              </MenuItem>
            ) : (
              <MenuItem
                disabled={updateClockIsLoading}
                onClick={async () => {
                  await updateClock("paused");
                  setAppBarMenuIsOpen(false);
                }}
              >
                <FormattedMessage
                  defaultMessage="Spiel für alle pausieren"
                  description="appbar menu item pause game"
                />
                {updateClockIsLoading && <ButtonProgressIndicator />}
              </MenuItem>
            )}
            <MenuItem onClick={onLeaveGame}>
              <FormattedMessage
                defaultMessage="Spiel verlassen"
                description="appbar menu item leave game"
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <MainNav />

      {isGameOver ? (
        <GameOverHeroMessage />
      ) : !character ? (
        <ChooseCharacterHeroMessage />
      ) : isPaused ? (
        <PausedHeroMessage />
      ) : (
        <Box component="main" paddingTop={10} paddingBottom={7}>
          <Container maxWidth="sm">
            <Parameters />
          </Container>
        </Box>
      )}
    </div>
  );
};

export default IndexPage;
