import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Box,
  Link,
} from "@material-ui/core";

import { info } from "images";

import { theme } from "theme";
import { AppFrame } from "../AppFrame";
import { User, Group, Activity } from "../ApplicationRoot";
import { StartActivity, ApiRoutes } from "../modules/API"

import { makeStyles } from "@material-ui/core/styles";

export interface Props {
  user: User;
  group: Group;
  activities: Activity[];
  setActivityCallback(Activity): void;
  alertToast?: string;
  noticeToast?: string;
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
    activityInfoIcon: {
      height: "24px",
    },
    clickable: {
      cursor: "pointer",
    }
  }),
  { defaultTheme: theme }
);

export default function ActivityIndex({
  user,
  group,
  activities,
  setActivityCallback,
  alertToast,
  noticeToast,
}: Props) {
  const classes = useStyles();

  const activityMarkup = activities.map((activity) => (
    <Grid item key={activity.name}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={1}
      >
        <Grid item>
          <Link
            rel="nofollow"
            onClick={() => JoinActivity(activity.name)}
            underline="none"
            color="textPrimary"
            className={classes.clickable}
          >
            <Paper elevation={0} className={classes.activityImage} />
          </Link>
        </Grid>
        <Grid item>
          <Link
            rel="nofollow"
            onClick={() => JoinActivity(activity.name)}
            underline="none"
            color="textPrimary"
            className={classes.clickable}
          >
            <Card variant="outlined">
              <CardContent classes={{ root: classes.activityCardContent }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{activity.displayName}</Typography>
                  <img src={info} className={classes.activityInfoIcon} />
                </Box>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  ));

  const appFrameProps = {
    users: group.users,
    groupId: group.key,
    meetUrl: "",
  };

  return (
    <AppFrame
      user={user}
      group={group}
      alertToast={alertToast}
      noticeToast={noticeToast}
    >
      <Card className={classes.greetingCard}>
        <CardContent classes={{ root: classes.greetingCardContent }}>
          <Typography variant="h5">Welcome, {user.name}!</Typography>
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

  async function JoinActivity(activity) {
    const response = await StartActivity(activity);

    if(response["errors"].length === 0) {
      setActivityCallback(response);
    } else {
      console.log(response);
    }
  }
}
