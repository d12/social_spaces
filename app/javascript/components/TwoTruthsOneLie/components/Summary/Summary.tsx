import React from "react";
import { Cable } from "actioncable";

import { ClientEvent } from "../../subscription-manager";
import { GameState, ActivityUser } from "../../TwoTruthsOneLie";

export interface Props {
  userId: number;
  subscription: Cable;
  gameState: GameState;
}

export function Summary({ userId, subscription, gameState }: Props) {
  console.log(gameState);
  const isLeader = userId === gameState.users[gameState.leaderIndex].id;

  const scoresMarkup = gameState.users.map((user, index) => {
    return (
      <div key={index}>
        <p>{user.name}</p>
        <b>{user.score} points</b>
        <br></br>
        <br></br>
      </div>
    );
  });

  const pageTitle = <h2>Round Summary</h2>

  const buttonMarkup = isLeader ? (
    <button onClick={initiateNextRound}>Play Again</button>
  ) : <p>Waiting for leader</p>;

  return (
    <>
      {pageTitle}
      <br></br>
      {scoresMarkup}
      <br></br>
      {buttonMarkup}
    </>
  );

  function initiateNextRound(): void {
    subscription.send({
      event: ClientEvent.INITIATED_NEXT_ROUND,
      userId,
    });
  }
}
