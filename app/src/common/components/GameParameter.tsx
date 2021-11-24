import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import * as React from "react";

type GameParameterProps = {
  /**
   * A representing icon, usually from @mui/icons-material
   */
  icon: React.ReactNode;

  /**
   * Current parameter value, e.g. 7
   */
  value: React.ReactNode;

  /**
   * Optional parameter label, e.g. Charakterpunkte
   */
  label?: React.ReactNode;
};

/**
 * A single game parameter
 */
const GameParameter = ({ icon, value, label }: GameParameterProps) => (
  <ListItem>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={value} secondary={label} />
  </ListItem>
);

export default GameParameter;
