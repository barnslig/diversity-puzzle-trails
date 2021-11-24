import { Box, Card, CardContent, List, Typography } from "@mui/material";
import * as React from "react";

type GameParameterCardProps = {
  /**
   * Common title of the presented game parameters
   */
  title: React.ReactNode;

  /**
   * Common description of the game parameters
   */
  description: React.ReactNode;

  /**
   * Put <GameParameter />s in here :)
   */
  children: React.ReactNode;
};

/**
 * A card presenting multiple game parameters
 */
const GameParameterCard = ({
  title,
  description,
  children,
}: GameParameterCardProps) => {
  return (
    <Card component="article" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box component="header" sx={{ marginBottom: 1 }}>
          <Typography sx={{ marginBottom: 1 }} variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </Box>
        <List disablePadding>{children}</List>
      </CardContent>
    </Card>
  );
};

export default GameParameterCard;
