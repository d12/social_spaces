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
    h3: {
      fontSize: "22px", // 18px in figma
      fontWeight: 600,
    },
    h2: {
      fontSize: "30px", // 24px in figma
      fontWeight: 600,
    },
    h1: {
      fontSize: "42px", // 36px in figma
      fontWeight: 600,
    }
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

let twoTruthsOneLieTheme: Theme = createMuiTheme({
  typography: {
    fontFamily: "Proxima Nova",
    h5: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h3: {
      fontSize: "22px", // 18px in figma
      fontWeight: 600,
    },
    h2: {
      fontSize: "30px", // 24px in figma
      fontWeight: 600,
    },
    h1: {
      fontSize: "42px", // 36px in figma
      fontWeight: 600,
    }
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
      paper: "#FFFFFF",
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
twoTruthsOneLieTheme = responsiveFontSizes(twoTruthsOneLieTheme);

let drawItTheme: Theme = createMuiTheme({
  typography: {
    fontFamily: "Proxima Nova",
    h5: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h3: {
      fontSize: "22px", // 18px in figma
      fontWeight: 600,
    },
    h2: {
      fontSize: "30px", // 24px in figma
      fontWeight: 600,
    },
    h1: {
      fontSize: "42px", // 36px in figma
      fontWeight: 600,
    }
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
      default: "#E1E9FF",
      paper: "#FFFFFF",
    },
    divider: "#C1CFF4",
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
drawItTheme = responsiveFontSizes(drawItTheme);

export { plainTheme, twoTruthsOneLieTheme, drawItTheme };
