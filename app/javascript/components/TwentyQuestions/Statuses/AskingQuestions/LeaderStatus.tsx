import React from "react";

import * as _styles from "../../TwentyQuestions.module.scss";

import { GameState, asker } from "../../TwentyQuestions";

interface Props {
  gameState: GameState;
  askedQuestionCallback(answer: string): void;
}

export default function AskingQuestionsLeaderStatus({
  gameState,
  askedQuestionCallback,
}: Props) {
  return (
    <>
      <h3>You're the leader!</h3>
      <h4>Question {gameState.questionIndex}</h4>
      <p>It's {asker(gameState).name}'s turn to ask you a yes/no question.</p>
      <p>Once they've asked you a question, select an answer from below:</p>
      <button onClick={() => askedQuestionCallback("yes")}>Yes</button>
      <button onClick={() => askedQuestionCallback("no")}>No</button>
      <button onClick={() => askedQuestionCallback("correctanswer")}>
        You guessed the word!
      </button>
    </>
  );
}
