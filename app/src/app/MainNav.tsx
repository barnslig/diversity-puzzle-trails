import { ChatBubble, Home } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useLocation } from "wouter";
import * as React from "react";

import QrCodeScanner from "../common/icons/QrCodeScanner";

import config from "../config";

type MainNavProps = {};

const MainNav = (props: MainNavProps) => {
  const [location, setLocation] = useLocation();

  return (
    <Paper
      elevation={8}
      component="nav"
      sx={{
        bottom: 0,
        left: 0,
        position: "fixed",
        width: "100%",
        zIndex: "appBar",
      }}
    >
      <BottomNavigation
        value={location}
        onChange={(ev, value) => value !== location && setLocation(value)}
        showLabels
      >
        <BottomNavigationAction
          value="/"
          label={
            <FormattedMessage
              defaultMessage="Status"
              description="main nav main page item label"
            />
          }
          icon={<Home />}
        />
        <BottomNavigationAction
          value="/scan"
          label={
            <FormattedMessage
              defaultMessage="Scanner"
              description="main nav scanner page item label"
            />
          }
          icon={<QrCodeScanner />}
        />
        {config.featureMessages && (
          <BottomNavigationAction
            value="/messages"
            label={
              <FormattedMessage
                defaultMessage="Nachrichten"
                description="main nav messages page item label"
              />
            }
            icon={<ChatBubble />}
          />
        )}
      </BottomNavigation>
    </Paper>
  );
};

export default MainNav;
