import { Box, Container, makeStyles, Typography } from "@material-ui/core";
import * as React from "react";
import theme from "../../app/theme";

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

const useStyle = makeStyles<typeof theme, HeroMessageProps>((theme) => ({
  root: {
    bottom: 0,
    left: 0,
    paddingBottom: (props) => theme.spacing(props.after ? 7 : 14),
    paddingTop: theme.spacing(10),
    position: "absolute",
    textAlign: "center",
    width: "100%",
  },
}));

/**
 * A hero message displayed on a page instead of its actual content
 * Example use cases: Game is paused, Character not set, ...
 */
const HeroMessage = (props: HeroMessageProps) => {
  const classes = useStyle(props);
  const { title, description, after } = props;

  return (
    <Box component="main" className={classes.root}>
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
