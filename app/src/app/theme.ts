import { createTheme } from "@material-ui/core/styles";

// bg: #353432 (dark gray)
// paper bg: #FFF (white)
// primary: #FD6B3A (orange)

const theme = createTheme({
  palette: {
    type: "dark",

    primary: {
      main: "#FD6B3A",
    },

    secondary: {
      main: "#FD6B3A", // TODO change secondary color to be different than primary
    },

    background: {
      default: "#353432",
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
