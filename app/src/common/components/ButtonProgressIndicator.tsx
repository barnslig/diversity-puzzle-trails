import { CircularProgress, makeStyles } from "@material-ui/core";
import * as React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

/**
 * Circular progress that can be put into a <Button /> while loading
 */
const ButtonProgressIndicator = () => {
  const classes = useStyles();
  return <CircularProgress size={24} className={classes.root} />;
};

export default ButtonProgressIndicator;
