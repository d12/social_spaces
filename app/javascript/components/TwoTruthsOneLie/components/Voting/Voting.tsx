import React, { useState } from "react";
import { Cable } from "actioncable";

import { ClientEvent } from "../../subscription-manager";
import { GameState, ActivityUser } from "../../TwoTruthsOneLie";
import { ActivityCard, ScoreBoard, PlayerScore} from "../../../Shared";
import { makeStyles } from "@material-ui/core/styles";

import {
  Grid
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
  }
}));

export function Voting({ userId, subscription, gameState, currentUserData }: Props) {
  const statements = gameState.users[gameState.whosTurnIndex].statements;
  const isMyTurn = userId === gameState.users[gameState.whosTurnIndex].id;

  const classes = useStyles();

  const header = isMyTurn ? "Others are guessing which is a lie... 🤔" : "Pick which one you think is a lie 🤔"

  const statementsMarkup = statements.map((statement, index) => {
    const voteButton = isMyTurn ? null : (
      <button type="submit" disabled={currentUserData.hasVoted} onClick={() => submitVote(index)}>
        Vote
      </button>
    );

    // PEOPLE WHO VOTED
    // {gameState.users.reduce((names, user) => {
    //   if (statement.voters.includes(user.id)) {
    //     return [...names, user.name];
    //   }
    //   return names;
    // }, [])}

    return (
      <div key={index}>

        <p> {voteButton} {statement.content}</p>
        <br />
      </div>
    );
  });

  const scores: PlayerScore[] = [
    {
      name: "Nathaniel",
      score: 2,
    },
    {
      name: "Lulu",
      score: 3,
    },
    {
      name: "Angie",
      score: 1,
    }
  ]

  return (
    <>
      <ActivityCard tall>
        <Grid
          container
          direction="row"
          className={classes.container}
        >
          <ScoreBoard scores={scores} selectedIndex={0} />
        </Grid>
      </ActivityCard>
    </>
  );

  function submitVote(voteIndex: number): void {
    subscription.send({
      event: ClientEvent.VOTED,
      userId,
      voteIndex,
    });
  }
}
