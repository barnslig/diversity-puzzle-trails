import { Box } from "@mui/material";
import * as React from "react";

type StickyActionButtonsProps = {
  children: React.ReactNode;
};

/**
 * A container for fullWidth action buttons that makes them sticky to the bottom
 */
const StickyActionButtons = ({ children }: StickyActionButtonsProps) => (
  <Box position="sticky" bottom={0} paddingY={2} bgcolor="background.default">
    {children}
  </Box>
);

export default StickyActionButtons;
