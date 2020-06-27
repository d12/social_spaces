import React from "react";

import * as _styles from "../../TwentyQuestions.module.scss";

import { GameState, leader, asker } from "../../TwentyQuestions";

interface Props {
  gameState: GameState;
}

export default function AskingQuestionsWaiterStatus({ gameState }: Props) {
  return (
    <>
      <h3>
        Waiting for {asker(gameState).name} to ask a yes/no question to{" "}
        {leader(gameState).name}
      </h3>
      <h4>Question: {gameState.questionIndex}</h4>
    </>
  );
}
