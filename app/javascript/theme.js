import { responsiveFontSizes, createMuiTheme } from "@material-ui/core/styles";

let theme = createMuiTheme({
  typography: {
    fontFamily: "Proxima Nova",
    h5: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: "#0B1624",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#44709D",
      contrastText: "#FFFFFF",
    },
  },
});
theme = responsiveFontSizes(theme);

export { theme };
