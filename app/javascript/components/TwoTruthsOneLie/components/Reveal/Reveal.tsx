import React from "react";
import { Cable } from "actioncable";

import { ClientEvent } from "../../subscription-manager";
import { GameState, ActivityUser } from "../../TwoTruthsOneLie";

export interface Props {
  userId: number;
  subscription: Cable;
  gameState: GameState;
}

export function Reveal({ userId, subscription, gameState }: Props) {
  const statements = gameState.users[gameState.whosTurnIndex].statements;
  const isLeader = userId === gameState.users[gameState.leaderIndex].id;

  const statementsMarkup = statements.map((statement, index) => {
    return (
      <div key={index}>
        <p>"{statement.content}"</p>
        <b>{statement.isLie ? "Lie" : "Truth"}</b>
        <br></br>
        <br></br>
      </div>
    );
  });

  const pageTitle = <h2>Results</h2>

  const buttonMarkup = isLeader ? (
    <button onClick={initiateNextTurn}>Next Player</button>
  ) : <p>Waiting for leader...</p>;

  return (
    <>
      {pageTitle}
      <br></br>
      {statementsMarkup}
      <br></br>
      {buttonMarkup}
    </>
  );

  function initiateNextTurn(): void {
    subscription.send({
      event: ClientEvent.INITIATED_NEXT_TURN,
      userId,
    });
  }
}
