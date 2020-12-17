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
    borderRadius: "8px",
    width: "100%",
    height: "76px",
    marginBottom: "21px",
  }
}));

export default function StatementBox({ statement, color }: Props) {
  const classes = useStyles();

  return (
    <Box className={classes.box} style={{backgroundColor: color}}>
      <Typography variant="h5">{statement}</Typography>
    </Box>
  );
}
