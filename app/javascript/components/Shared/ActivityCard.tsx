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
  backgroundCardSm: {
    width: "75vw",
    height: "60vh",
    borderRadius: "10px",
  },
  backgroundCardMd: {
    width: "75vw",
    height: "70vh",
    borderRadius: "10px",
  },
  backgroundCardLg: {
    width: "75vw",
    height: "78vh",
    borderRadius: "10px",
  }
}));

interface Props {
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export function ActivityCard({ children, size }: Props) {
  const classes = useStyles();

  if (!size)
    size = "sm";

  const sizeToClassMap = {
    "sm": classes.backgroundCardSm,
    "md": classes.backgroundCardMd,
    "lg": classes.backgroundCardLg,
  }

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.cardContainer}
    >
      <Card variant="outlined" className={sizeToClassMap[size]}>
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
