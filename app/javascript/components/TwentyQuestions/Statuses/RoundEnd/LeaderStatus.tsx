import React from "react";

import * as _styles from "../../TwentyQuestions.module.scss";

import { GameState, RoundEndState } from "../../TwentyQuestions";

import { Typography, Button } from "@material-ui/core";

interface Props {
  gameState: GameState;
  beginNextRoundCallback(): void;
}

export default function RoundEndLeaderStatus({
  gameState,
  beginNextRoundCallback,
}: Props) {
  const wordGuessedMarkup =
    gameState.roundEndState === RoundEndState.WIN
      ? "The word was guessed!"
      : "The word was not guessed!";

  return (
    <>
      <Typography paragraph>{wordGuessedMarkup}</Typography>
      <Typography paragraph>The word was: {gameState.word}</Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={beginNextRoundCallback}
      >
        Begin next round
      </Button>
    </>
  );
}
