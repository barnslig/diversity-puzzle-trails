import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material";
import * as React from "react";

const PREFIX = "NotificationProvider";

const classes = {
  containerRoot: `${PREFIX}-root`,
};

const StyledSnackbarWrapper = styled("div")(({ theme }) => ({
  [`&&& .${classes.containerRoot}`]: {
    bottom: theme.spacing(9),
    left: theme.spacing(2),
  },
}));

export type NotificationProviderProps = {
  children: React.ReactNode;
};

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  return (
    <StyledSnackbarWrapper>
      <SnackbarProvider
        classes={{ containerRoot: classes.containerRoot }}
        hideIconVariant
        maxSnack={1}
      >
        {children}
      </SnackbarProvider>
    </StyledSnackbarWrapper>
  );
};

export default NotificationProvider;
