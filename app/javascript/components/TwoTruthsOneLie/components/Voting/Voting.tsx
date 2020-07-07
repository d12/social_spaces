import React, { useState } from "react";
import { Cable } from "actioncable";

import { ClientEvent } from "../../subscription-manager";
import { GameState } from "../../TwoTruthsOneLie";

export interface Props {
  userId: number;
  subscription: Cable;
  gameState: GameState;
}

export function Voting({ userId, subscription, gameState }: Props) {
  const [voted, setVoted] = useState(false);
  const statements = gameState.users[gameState.leaderIndex].statements;
  const isMyTurn = userId === gameState.users[gameState.whosTurnIndex].id;

  const statementsMarkup = statements.map((statement, index) => {
    const voteButton = isMyTurn ? null : (
      <button type="submit" disabled={voted} onClick={() => submitVote(index)}>
        Vote
      </button>
    );

    return (
      <div key={index}>
        {voteButton}
        <p>Statement: {statement.content}</p>
        <p>People who voted for this statement:</p>
        {gameState.users.reduce((names, user) => {
          if (statement.voters.includes(user.id)) {
            return [...names, user.name];
          }
          return names;
        }, [])}
      </div>
    );
  });

  const pageTitle = isMyTurn ? (
    <p>Other people are deciding which of your statements is a lie...</p>
  ) : (
    <p>Vote for the statement that you think is a lie.</p>
  );

  return (
    <>
      {pageTitle}
      {statementsMarkup}
    </>
  );

  function submitVote(voteIndex: number): void {
    setVoted(true);

    subscription.send({
      event: ClientEvent.VOTED,
      userId,
      voteIndex,
    });
  }
}
