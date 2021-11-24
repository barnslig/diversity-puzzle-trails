import { CircularProgress } from "@mui/material";
import * as React from "react";

/**
 * Circular progress that can be put into a <Button /> while loading
 */
const ButtonProgressIndicator = () => (
  <CircularProgress
    size={24}
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-12px",
      marginLeft: "-12px",
    }}
  />
);

export default ButtonProgressIndicator;
