import React from "react";

import {
  Grid,
  Box,
  Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

interface Props {
  statement: string;
  color: string;
}

const useStyles = makeStyles((_theme) => ({
  box: {
    paddingTop: "22px",
    paddingLeft: "20px",
    width: "100%",
    height: "76px",
    marginBottom: "21px",
  },
  underline: {
    height: "8px",
    width: "100%",
    marginTop: "10px",
  },
  statement: {
    marginLeft: "25px",
  }
}));

export default function StatementBox({ statement, color }: Props) {
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      <Typography variant="h3" className={classes.statement}>{statement}</Typography>
      <Box className={classes.underline} style={{backgroundColor: color}} />
    </Box>
  );
}
