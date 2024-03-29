import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import * as React from "react";

import {
  useParameters,
  useIsGameOver,
} from "../../common/hooks/api/useParameters";
import useCharacter from "../../common/hooks/useCharacter";
import useClock from "../../common/hooks/api/useClock";
import useLeaveGame from "../../common/hooks/useLeaveGame";
import usePwaInstaller from "../../common/hooks/usePwaInstaller";

import ChooseCharacterHeroMessage from "../../common/components/ChooseCharacterHeroMessage";
import GameOverHeroMessage from "../../common/components/GameOverHeroMessage";
import PausedHeroMessage from "../../common/components/PausedHeroMessage";

import Parameters from "../../features/parameters/Parameters";

import MainNav from "../MainNav";

type IndexPageProps = {};

const IndexPage = (props: IndexPageProps) => {
  const intl = useIntl();

  const [character] = useCharacter();

  const clock = useClock();
  const isPaused = clock.data?.data.attributes.state === "paused";

  const parameters = useParameters();
  const isGameOver = useIsGameOver(parameters?.data);

  const appBarMenuAnchorEl = React.useRef<HTMLButtonElement>(null);
  const [appBarMenuIsOpen, setAppBarMenuIsOpen] = React.useState(false);

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

  const { canInstall, triggerInstall } = usePwaInstaller();

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography component="h1" sx={{ flexGrow: 1 }} variant="h6">
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
            size="large"
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
            <MenuItem onClick={onLeaveGame}>
              <FormattedMessage
                defaultMessage="Spiel verlassen"
                description="appbar menu item leave game"
              />
            </MenuItem>
            {canInstall && (
              <MenuItem onClick={triggerInstall}>
                <FormattedMessage
                  defaultMessage="Zum Homescreen hinzufügen"
                  description="appbar menu item install pwa"
                />
              </MenuItem>
            )}
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
