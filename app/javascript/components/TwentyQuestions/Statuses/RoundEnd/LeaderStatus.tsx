import React from "react";

import * as _styles from "../../TwentyQuestions.module.scss";

import { GameState, RoundEndState } from "../../TwentyQuestions";

interface Props {
  gameState: GameState;
  beginNextRoundCallback(): void;
}

export default function RoundEndLeaderStatus({
  gameState,
  beginNextRoundCallback,
}: Props) {
  if (gameState.roundEndState === RoundEndState.WIN) {
    return (
      <>
        <h3>The word was guessed!</h3>
        <h4>The word was: {gameState.word}</h4>
        <button onClick={beginNextRoundCallback}>Begin next round</button>
      </>
    );
  } else {
    return (
      <>
        <h3>The word was not guessed!</h3>
        <h4>The word was: {gameState.word}</h4>
        <button onClick={beginNextRoundCallback}>Begin next round</button>
      </>
    );
  }
}
