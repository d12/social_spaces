import React from "react";

import {
  Grid,
  Box,
  Card,
  CardContent,
} from "@material-ui/core";

import { makeStyles, useTheme } from "@material-ui/core/styles";

interface Props {
  step: number;
}

const useStyles = makeStyles((_theme) => ({
  wrapper: {
    marginTop: "20px",
    marginBottom: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  line: {
    height: "0px",
    flexGrow: 1,
    border: "2px solid",
    borderRadius: "2px",
  },
  circle: {
    border: "15px solid",
    borderRadius: "100%",
    marginLeft: "10px",
    marginRight: "10px",
  }
}));

export default function ProgressBar({ step }: Props) {
  const classes = useStyles();

  const filledInColor = "#74A2CC";
  const emptyColor = "#D9EDFF";

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.wrapper}
    >
      <Box className={classes.circle} style={{borderColor: filledInColor}}/>
      <Box className={classes.line} style={{borderColor: step > 1 ? filledInColor : emptyColor}}/>
      <Box className={classes.circle} style={{borderColor: step > 1 ? filledInColor : emptyColor}}/>
      <Box className={classes.line} style={{borderColor: step > 2 ? filledInColor : emptyColor}}/>
      <Box className={classes.circle} style={{borderColor: step > 2 ? filledInColor : emptyColor}}/>
    </Grid>
  );
}
