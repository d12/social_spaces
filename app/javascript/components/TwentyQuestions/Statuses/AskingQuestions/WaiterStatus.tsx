import React from "react";

import * as _styles from "../../TwentyQuestions.module.scss";

import { GameState, leader, asker } from "../../TwentyQuestions";

import { Typography, Box } from "@material-ui/core";

interface Props {
  gameState: GameState;
}

export default function AskingQuestionsWaiterStatus({ gameState }: Props) {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>
          Waiting for {asker(gameState).name} to ask a yes/no question to{" "}
          {leader(gameState).name}
        </Typography>
        <Typography variant="h5">Question {gameState.questionIndex}</Typography>
      </Box>
    </Box>
  );
}
