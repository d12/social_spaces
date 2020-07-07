import React from "react";

import * as _styles from "./TwentyQuestions.module.scss";

import { GameState, leader } from "./TwentyQuestions";

interface Props {
  gameState: GameState;
  isLeader: boolean;
  selectWordCallback(word: string): void;
}

export default function SelectingWordStatus({
  gameState,
  isLeader,
  selectWordCallback,
}: Props) {
  if (isLeader) {
    return (
      <>
        <h3>Please select a word:</h3>
        {gameState.wordOptions.map((word) => {
          return (
            <button key={word} onClick={() => selectWordCallback(word)}>
              {word}
            </button>
          );
        })}
      </>
    );
  } else {
    return <h3>Please wait for {leader(gameState).name} to choose a word</h3>;
  }
}
