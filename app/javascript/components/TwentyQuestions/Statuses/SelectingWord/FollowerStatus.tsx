import React from "react";

import { GameState, leader } from "../../TwentyQuestions";

import { Typography } from "@material-ui/core";

interface Props {
  gameState: GameState;
}

export default function SelectingWordFollowerStatus({ gameState }: Props) {
  return (
    <Typography>
      Please wait for {leader(gameState).name} to choose a word...
    </Typography>
  );
}
