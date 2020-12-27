import React, { useState, useEffect } from "react";
import { Cable } from "actioncable";

import { ClientEvent } from "../../subscription-manager";
import { GameState, ActivityUser } from "../../TwoTruthsOneLie";
import { ActivityCard, ScoreBoard, PlayerScore} from "../../../Shared";
import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  Box,
  Typography,
  Button,
} from "@material-ui/core";

import {
  ToggleButton,
  ToggleButtonGroup,
} from "@material-ui/lab";

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
  },
  voteButtonNew: {
    height: "80px",
    width: "51vw",
    marginTop: "45px !important",
    paddingLeft: "23px",
    borderRadius: "8px !important",
    border: "1px solid #74A2CC !important",
    '&:hover': {
      backgroundColor: "#F2F9FF"
    }
  },
  voteButtonText: {
    color: "#000000",
  },
  voteButtonSelected: {
    backgroundColor: "#F2F9FF !important",
  }
}));

export function Voting({ userId, subscription, gameState, currentUserData }: Props) {
  const currentUser = gameState.users[gameState.whosTurnIndex];
  const statements = currentUser.statements;
  const isMyTurn = userId === gameState.users[gameState.whosTurnIndex].id;
  const allUsersHaveVoted = gameState.users.filter(u => u.hasVoted).length === (gameState.users.length - 1);
  const userVotedStatementIndex = currentUser.statements.findIndex(s => s.voters.includes(userId));
  const usersVoteWasCorrect = allUsersHaveVoted && !isMyTurn && currentUser.statements.find(s => s.isLie).voters.includes(userId);
  const numberOfWrongUsers = allUsersHaveVoted && (gameState.users.length - currentUser.statements.find(s => s.isLie).voters.length - 1);

  const classes = useStyles();

  const [votedIndex, setVotedIndex] = useState<number>(null);

  useEffect(() => {
    if(userVotedStatementIndex !== votedIndex)
      setVotedIndex(userVotedStatementIndex);
  }, [gameState]);

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
      <ToggleButton
        className={classes.voteButtonNew}
        key={index}
        color="primary"
        value={index}
        onClick={() => submitVote(index)}
        classes={{
          selected: classes.voteButtonSelected,
        }}
        style={{ justifyContent: "flex-start", textTransform: "initial" }}
        disabled={allUsersHaveVoted || isMyTurn}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
        >
          <Typography variant="h3" className={classes.voteButtonText}>{statement.content}</Typography>
          {revealTextMarkup}
        </Grid>
      </ToggleButton>
    );
  });

  let message = null;
  let messageColor = "#000000";

  if(currentUserData.hasVoted && !allUsersHaveVoted) {
    message = "Waiting for other's to vote...";
  } else if(isMyTurn && allUsersHaveVoted) {
    const personWord = numberOfWrongUsers === 1 ? "person" : "people";
    message = numberOfWrongUsers === 0 ?
    "Oof, you didn't fool anyone this time!" :
    `You fooled ${numberOfWrongUsers} ${personWord}!`;
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
      <Typography variant="h2" style={{color: messageColor}}>{message}</Typography>
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
            <Typography variant="h2">{header}</Typography>
            <ToggleButtonGroup
              orientation="vertical"
              exclusive
              value={votedIndex}
            >
              {voteButtonsMarkup}
            </ToggleButtonGroup>

            {messageMarkup}
          </Box>
        </Grid>
      </ActivityCard>
    </>
  );

  function submitVote(voteIndex: number): void {
    if(isMyTurn || allUsersHaveVoted)
      return;

    setVotedIndex(voteIndex);

    subscription.send({
      event: ClientEvent.VOTED,
      userId,
      voteIndex,
    });
  }

  function initiateNextTurn(): void {
    subscription.send({
      event: ClientEvent.INITIATED_NEXT_TURN,
      userId,
    });
  }
}
