import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Home } from "@mui/icons-material";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "wouter";
import QrCodeScanner from "../common/icons/QrCodeScanner";

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
      </BottomNavigation>
    </Paper>
  );
};

export default MainNav;
