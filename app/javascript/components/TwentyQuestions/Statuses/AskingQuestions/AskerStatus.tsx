import React from "react";

import { GameState, leader } from "../../TwentyQuestions";

import { Typography, Box } from "@material-ui/core";

interface Props {
  gameState: GameState;
}

export default function AskingQuestionsAskerStatus({ gameState }: Props) {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>
          It's your turn to ask a Yes/No question to {leader(gameState).name}
        </Typography>
        <Typography variant="h5">Question {gameState.questionIndex}</Typography>
      </Box>
    </Box>
  );
}
