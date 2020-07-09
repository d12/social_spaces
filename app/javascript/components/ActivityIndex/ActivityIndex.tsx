import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Toolbar,
  Box,
} from "@material-ui/core";

import { theme } from "theme";
import { AppFrame } from "../AppFrame";

import { makeStyles } from "@material-ui/core/styles";

export interface Props {
  userName: string;
  groupId: string;
  meetUrl: string;
  activities: Activity[];
  users: User[];
}

interface Activity {
  displayName: string;
  maxUsers: string;
  name: number;
}

interface User {
  id: number;
  name: string;
}

const useStyles = makeStyles(
  (theme) => ({
    greetingCard: {
      backgroundColor: theme.palette.primary.main,
      marginTop: theme.spacing(3),
      color: theme.palette.getContrastText(theme.palette.primary.main),
    },
    greetingCardContent: {
      padding: theme.spacing(4),
      "&:last-child": {
        paddingBottom: theme.spacing(4),
      },
    },
    activityImage: {
      height: "200px",
      width: "275px",
      backgroundColor: "#FFEEE1",
    },
    activityCardContent: {
      padding: theme.spacing(1),
      "&:last-child": {
        paddingBottom: theme.spacing(1),
      },
    },
  }),
  { defaultTheme: theme }
);

export default function ActivityIndex({
  userName,
  groupId,
  meetUrl,
  activities,
  users,
}: Props) {
  const classes = useStyles();

  const activityMarkup = activities.map((activity) => (
    <Grid item>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={1}
      >
        <Grid item>
          <Paper elevation={0} className={classes.activityImage} />
        </Grid>
        <Grid item>
          <Card variant="outlined">
            <CardContent classes={{ root: classes.activityCardContent }}>
              <Typography>{activity.displayName}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  ));

  return (
    <AppFrame>
      <Toolbar />
      <Card className={classes.greetingCard}>
        <CardContent classes={{ root: classes.greetingCardContent }}>
          <Typography variant="h5">Welcome, {userName}!</Typography>
          <Typography>Find a game for you and your team to play.</Typography>
        </CardContent>
      </Card>
      <Box mt={3}>
        <Typography variant="h6">ACTIVITIES</Typography>
        <Box mt={1}>
          <Card>
            <CardContent>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={4}
              >
                {activityMarkup}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </AppFrame>
  );
}
