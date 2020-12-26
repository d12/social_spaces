import React, { useState } from "react";
import { Cable } from "actioncable";

import { ClientEvent } from "../../subscription-manager";
import { GameState, ActivityUser } from "../../TwoTruthsOneLie";
import { ActivityCard, ScoreBoard, PlayerScore} from "../../../Shared";
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
  currentUserData: ActivityUser;
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
  voteButton: {
    height: "80px",
    width: "51vw",
    marginTop: "45px",
    paddingLeft: "23px",
    borderRadius: "8px",
    borderStyle: "solid",
    borderColor: "#74A2CC",
    borderWidth: "1px",
    '&:hover': {
      backgroundColor: "#F2F9FF",
    }
  },
  votedButton: {
    height: "80px",
    width: "51vw",
    marginTop: "45px",
    paddingLeft: "23px",
    borderRadius: "8px",
    borderStyle: "solid",
    borderColor: "#74A2CC",
    borderWidth: "1px",
    backgroundColor: "#F2F9FF"
  },
  message: {
    marginTop: "7vh",
  },
  revealText: {
    marginRight: "20px"
  },
  button: {
    position: "absolute",
    bottom: 0,
    marginBottom: "10px",
  }
}));

export function Voting({ userId, subscription, gameState, currentUserData }: Props) {
  const currentUser = gameState.users[gameState.whosTurnIndex];
  const statements = currentUser.statements;
  const isMyTurn = userId === gameState.users[gameState.whosTurnIndex].id;
  const allUsersHaveVoted = gameState.users.filter(u => u.hasVoted).length === (gameState.users.length - 1);
  const usersVoteWasCorrect = allUsersHaveVoted && !isMyTurn && currentUser.statements.find(s => s.isLie).voters.includes(userId);
  const numberOfWrongUsers = allUsersHaveVoted && (gameState.users.length - currentUser.statements.find(s => s.isLie).voters.length - 1);

  const classes = useStyles();

  const voteButtonsMarkup = statements.map((statement, index) => {
    const revealTextMarkup = allUsersHaveVoted ? (
      <Typography
        variant="h3"
        style={{color: statement.isLie ? "#BD201C" : "#20BD1C"}}
        className={classes.revealText}
      >
        {statement.isLie ? "Lie" : "Truth"}
      </Typography>
    ) : "";

    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
        className={statement.voters.includes(userId) ? classes.votedButton : classes.voteButton}
        key={index}
        onClick={() => submitVote(index)}
      >
        <Typography variant="h2">{statement.content}</Typography>
        {revealTextMarkup}
      </Grid>
    );
  });

  let message = null;
  let messageColor = "#000000";

  if(currentUserData.hasVoted && !allUsersHaveVoted) {
    message = "Waiting for other's to vote...";
  } else if(isMyTurn && allUsersHaveVoted) {
    const personWord = numberOfWrongUsers === 1 ? "person" : "people";
    message = `You fooled ${numberOfWrongUsers} ${personWord}, nice work!`;
  } else if(allUsersHaveVoted && usersVoteWasCorrect) {
    message = "You got it, good guess!";
    messageColor = "#20BD1C";
  } else if(allUsersHaveVoted && !usersVoteWasCorrect) {
    message = "Incorrect!";
    messageColor = "#BD201C";
  }

  const nextTurnButtonMarkup = allUsersHaveVoted && isMyTurn && (
    <Button className={classes.button} onClick={initiateNextTurn} color="secondary" variant="contained">Next player</Button>
  );

  const messageMarkup = message && <Grid
      container
      alignItems="center"
      justify="center"
      className={classes.message}
    >
      <Typography variant="h1" style={{color: messageColor}}>{message}</Typography>
      {nextTurnButtonMarkup}
    </Grid>;

  const scores: PlayerScore[] = gameState.users.map((user) => {
    return {
      name: user.name,
      score: user.score,
    };
  });

  const header = allUsersHaveVoted ?
    "Results:" : (isMyTurn ?
    `Other players are guessing your lie` :
    `Which is ${currentUser.name}'s lie?`);

  return (
    <>
      <ActivityCard tall>
        <Grid
          container
          direction="row"
          className={classes.container}
        >
          <ScoreBoard scores={scores} selectedIndex={gameState.whosTurnIndex} />
          <Box className={classes.divider} />
          <Box className={classes.mainContainer}>
            <Typography variant="h1">{header}</Typography>
            {voteButtonsMarkup}
            {messageMarkup}
          </Box>
        </Grid>
      </ActivityCard>
    </>
  );

  function submitVote(voteIndex: number): void {
    if(!currentUser.hasVoted && !isMyTurn){
      subscription.send({
        event: ClientEvent.VOTED,
        userId,
        voteIndex,
      });
    }
  }

  function initiateNextTurn(): void {
    subscription.send({
      event: ClientEvent.INITIATED_NEXT_TURN,
      userId,
    });
  }
}
