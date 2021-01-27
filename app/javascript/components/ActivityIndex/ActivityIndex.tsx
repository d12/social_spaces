import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Box,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from "@material-ui/core";

import { info } from "images";

import { User, Group, Activity } from "../ApplicationRoot";
import { API } from "../modules/API"

import { makeStyles } from "@material-ui/core/styles";

export interface Props {
  user: User;
  activities: Activity[];
  setGroupCallback(group: Group): void;
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
      height: "165px",
      width: "275px",
      backgroundColor: "#FFEEE1",
    },
    activityDescription: {
      paddingLeft: "15px",
      paddingRight: "15px",
    },
    dialogActivityImage: {
      height: "300px",
      width: "550px",
      backgroundColor: "#FFEEE1",
      marginBottom: "20px",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
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
    },
    dialog: {
      paddingLeft: "15px",
      paddingRight: "15px"
    }
  })
);

export default function ActivityIndex({
  user,
  activities,
  setGroupCallback,
}: Props) {
  const classes = useStyles();

  const [openDialog, setOpenDialog] = React.useState(null);

  const activityMarkup = activities.map((activity, index) => (
    <Grid item key={"activity-" + activity.name}>
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
            onClick={() => previewActivity(index)}
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
            onClick={() => previewActivity(index)}
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
      <Dialog
        open={openDialog === index}
        onClose={handleCloseDialog}
      >
        <DialogTitle id="alert-dialog-title"><strong>{activity.displayName}</strong></DialogTitle>
        <DialogContent>
          <Paper elevation={0} className={classes.dialogActivityImage} />
          <DialogContentText id="alert-dialog-description" className={classes.activityDescription}>
            {activity.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Back
          </Button>
          <Button onClick={() => joinActivity(index)} color="primary">
            Play
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  ));

  return (
    <>
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
    </>
  );

  function handleCloseDialog() {
    setOpenDialog(null);
  }

  function previewActivity(activityIndex: number) {
    setOpenDialog(activityIndex);
  }

  async function joinActivity(activityIndex: number) {
    const response = await API.startActivity(activities[activityIndex].name);

    if (response["errors"] === undefined) {
      setGroupCallback(response);
    } else {
      alert(response["errors"]);
    }
  }
}
