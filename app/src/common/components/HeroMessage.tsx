import { Box, Container, Typography } from "@mui/material";
import * as React from "react";

type HeroMessageProps = {
  /**
   * Title
   */
  title: React.ReactNode;

  /**
   * Optional description text
   */
  description?: React.ReactNode;

  /**
   * Optional nodes placed after the description
   */
  after?: React.ReactNode;
};

/**
 * A hero message displayed on a page instead of its actual content
 * Example use cases: Game is paused, Character not set, ...
 */
const HeroMessage = ({ title, description, after }: HeroMessageProps) => {
  return (
    <Box
      component="main"
      sx={{
        bottom: 0,
        left: 0,
        paddingBottom: after ? 7 : 14,
        paddingTop: 10,
        position: "absolute",
        textAlign: "center",
        width: "100%",
      }}
    >
      <Container maxWidth="sm">
        {title && (
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        )}
        {after}
      </Container>
    </Box>
  );
};

export default HeroMessage;
