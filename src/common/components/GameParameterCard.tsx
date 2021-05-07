import {
  Card,
  CardContent,
  List,
  makeStyles,
  Typography,
} from "@material-ui/core";
import * as React from "react";

const useStyle = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  cardHeader: {
    marginBottom: theme.spacing(1),
  },
  cardHeaderHl: {
    marginBottom: theme.spacing(1),
  },
}));

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
  const classes = useStyle();

  return (
    <Card className={classes.card} component="article">
      <CardContent>
        <header className={classes.cardHeader}>
          <Typography
            className={classes.cardHeaderHl}
            variant="h5"
            component="h2"
          >
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </header>
        <List disablePadding>{children}</List>
      </CardContent>
    </Card>
  );
};

export default GameParameterCard;
