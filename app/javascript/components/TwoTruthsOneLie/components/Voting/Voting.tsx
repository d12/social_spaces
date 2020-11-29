import React, { useState } from "react";
import { Cable } from "actioncable";

import { ClientEvent } from "../../subscription-manager";
import { GameState, ActivityUser } from "../../TwoTruthsOneLie";

export interface Props {
  userId: number;
  subscription: Cable;
  gameState: GameState;
  currentUserData: ActivityUser;
}

export function Voting({ userId, subscription, gameState, currentUserData }: Props) {
  const statements = gameState.users[gameState.whosTurnIndex].statements;
  const isMyTurn = userId === gameState.users[gameState.whosTurnIndex].id;

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

  return (
    <>
      <h2>{header}</h2>
      {statementsMarkup}
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
