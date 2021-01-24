import React from "react";
import { Cable } from "actioncable";

import { ClientEvent } from "../../subscription-manager";
import { GameState } from "../../TwoTruthsOneLie";
import { ActivityCard, ScoreBoard, PlayerScore } from "../../../Shared";
import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  Box,
  Typography,
  Button
} from "@material-ui/core";

export interface Props {
  userId: number;
  subscription: Cable;
  gameState: GameState;
}

const useStyles = makeStyles((_theme) => ({
  container: {
    margin: "10px",
    position: "relative",
  },
  divider: {
    backgroundColor: "#F6F6F4",
    width: "2px",
    height: "72vh",
    marginLeft: "15px",
    marginRight: "15px",
  },
  mainContainer: {
    marginLeft: "20px",
    paddingTop: "20px",
  },
  button: {

  },
  actionContainer: {
    width: "55vw",
    height: "90%"
  }
}));

export function Summary({ userId, subscription, gameState }: Props) {
  const isMyTurn = userId === gameState.users[gameState.whosTurnIndex].id;

  const classes = useStyles();

  const scores: PlayerScore[] = gameState.users.map((user) => {
    return {
      name: user.name,
      score: user.score,
      id: user.id,
    };
  });

  const header = `End of round ${gameState.roundCount}!`

  const nextRoundMarkup = isMyTurn && <>
    <Button
      className={classes.button}
      onClick={initiateNextRound}
      color="secondary"
      variant="contained"
    >
      Start next round
    </Button>
  </>;

  const waitingForLeaderMarkup = !isMyTurn && <>
    <Typography variant="h2">Waiting for the host to begin the next round.</Typography>
  </>;

  return (
    <>
      <ActivityCard size="lg">
        <Grid
          container
          direction="row"
          className={classes.container}
        >
          <ScoreBoard scores={scores} selectedIndex={gameState.whosTurnIndex} />
          <Box className={classes.divider} />
          <Box className={classes.mainContainer}>
            <Typography variant="h1">{header}</Typography>
            <Grid
              container
              alignItems="center"
              justify="center"
              className={classes.actionContainer}
            >
              {nextRoundMarkup || waitingForLeaderMarkup}
            </Grid>
          </Box>
        </Grid>
      </ActivityCard>
    </>
  );

  function initiateNextRound(): void {
    subscription.send({
      event: ClientEvent.INITIATED_NEXT_ROUND,
      userId,
    });
  }
}
