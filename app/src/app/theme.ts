import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FD6B3A",
    },
  },
  typography: {
    h5: {
      fontFamily: "Roboto Condensed",
      fontWeight: 700,
      fontStyle: "italic",
      textTransform: "uppercase",
    },
  },
});

export default theme;
