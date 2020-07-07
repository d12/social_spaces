import React from "react";

import * as _styles from "../../TwentyQuestions.module.scss";

import { GameState, RoundEndState } from "../../TwentyQuestions";

interface Props {
  gameState: GameState;
}

export default function RoundEndLeaderStatus({ gameState }: Props) {
  if (gameState.roundEndState === RoundEndState.WIN) {
    return (
      <>
        <h3>The word was guessed!</h3>
        <h4>The word was: {gameState.word}</h4>
        <p>Please wait for the leader to begin the next round...</p>
      </>
    );
  } else {
    return (
      <>
        <h3>The word wasn't guessed!</h3>
        <h4>The word was: {gameState.word}</h4>
        <p>Please wait for the leader to begin the next round...</p>
      </>
    );
  }
}
