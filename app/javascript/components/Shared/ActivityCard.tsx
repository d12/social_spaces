import React from "react";

import {
  Grid,
  Box,
  Card,
  CardContent,
} from "@material-ui/core";

import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((_theme) => ({
  cardContainer: {
    height: "100%",
    minHeight: "100%",
  },
  backgroundCard: {
    width: "60vw",
    height: "60vh",
    borderRadius: "10px",
  },
}));

interface Props {
  children?: React.ReactNode;
}

export function ActivityCard({ children }: Props) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.cardContainer}
    >
      <Card variant="outlined" className={classes.backgroundCard}>
        <CardContent>
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
          >
            {children}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
