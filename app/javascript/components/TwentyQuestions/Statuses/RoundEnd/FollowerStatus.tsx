import React from "react";

import * as _styles from "../../TwentyQuestions.module.scss";

import { GameState, RoundEndState } from "../../TwentyQuestions";

import { Typography } from "@material-ui/core";

interface Props {
  gameState: GameState;
}

export default function RoundEndLeaderStatus({ gameState }: Props) {
  const wordGuessedMarkup =
    gameState.roundEndState === RoundEndState.WIN
      ? "The word was guessed!"
      : "The word was not guessed!";
  return (
    <>
      <Typography paragraph>{wordGuessedMarkup}</Typography>
      <Typography paragraph>
        The word was: <strong>{gameState.word}</strong>
      </Typography>
      <Typography>
        Please wait for the leader to begin the next round...
      </Typography>
    </>
  );
}
