import { responsiveFontSizes, createMuiTheme, Theme } from "@material-ui/core/styles";

let plainTheme: Theme = createMuiTheme({
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
  overrides: {
    MuiButton: {
      textSecondary: { color: "#FFFFFF"},
      containedSecondary: {
        backgroundColor: "#0B1624",
        color: "#FFFFFF",
      }
    }
  }
});
plainTheme = responsiveFontSizes(plainTheme);

let orangeTheme: Theme = createMuiTheme({
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
    background: {
      default: "#FFD9B6",
      paper: "#FFD9B6",
    },
    divider: "#F5C89F",
  },
  overrides: {
    MuiButton: {
      containedSecondary: {
        backgroundColor: "#0B1624",
        color: "#FFFFFF",
        paddingLeft: "40px",
        paddingRight: "40px",
      }
    }
  }
});
orangeTheme = responsiveFontSizes(orangeTheme);

export { plainTheme, orangeTheme };
