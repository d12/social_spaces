import React from "react";
import { Cable } from "actioncable";

import { ClientEvent } from "../../subscription-manager";
import { GameState, ActivityUser } from "../../TwoTruthsOneLie";
import { Group } from "../../../ApplicationRoot"

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  Grid,
  Box,
  TextField,
  Paper,
} from "@material-ui/core";

import { twoTruthsTitleBlob } from "../../../../images"

import { makeStyles, useTheme } from "@material-ui/core/styles";

export interface Props {
  userId: number;
  group: Group;
  subscription: Cable;
  gameState: GameState;
}

const useStyles = makeStyles((_theme) => ({
  blobSpacer: {
    height: "200px",
  },
  blobBox: {
    width: "80vh",
    margin: "0 auto",
  },
  blob: {
    height: "50vh",
    width: "80vh",
    background: `url(${twoTruthsTitleBlob}) no-repeat center center`,
    backgroundSize: "100%",
  },
  content: {
    paddingTop: "20vh",
  },
  header: {
    paddingBottom: "4vh",
  },
  button: {
  },
}));

export function WaitingToStart({ userId, group, subscription, gameState }: Props) {
  const isHost = userId === group.hostId;
  const classes = useStyles(useTheme());

  function beginGame(): void {
    subscription.send({
      event: ClientEvent.BEGIN_GAME,
      userId,
    });
  }

  return <>
    <Box className={classes.blobSpacer} />
    <Box className={classes.blobBox}>
      <Box className={classes.blob}>
        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="center"
          className={classes.content}
        >
          <Typography className={classes.header} variant="h4">Two Truths and a Lie</Typography>
          <Button className={classes.button} onClick={beginGame} color="secondary" variant="contained">Begin</Button>
        </Grid>
      </Box>
    </Box>
  </>;


}
