import React from "react";

import * as _styles from "../../TwentyQuestions.module.scss";

import { GameState, leader } from "../../TwentyQuestions";

interface Props {
  gameState: GameState;
}

export default function AskingQuestionsAskerStatus({ gameState }: Props) {
  return (
    <>
      <h3>
        It's your turn to ask a Yes/No question to {leader(gameState).name}
      </h3>
      <h4>Question {gameState.questionIndex}</h4>
    </>
  );
}
