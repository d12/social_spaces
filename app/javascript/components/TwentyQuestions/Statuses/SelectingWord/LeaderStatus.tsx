import React from "react";
import { GameState } from "../../TwentyQuestions";

import { Typography, Box, Button } from "@material-ui/core";

interface Props {
  gameState: GameState;
  selectWordCallback(word: string): void;
}

export default function SelectingWordLeaderStatus({
  gameState,
  selectWordCallback,
}: Props) {
  return (
    <Box>
      <Typography variant="h6">Please select a word:</Typography>
      <Box display="flex" mt={1}>
        {gameState.wordOptions.map((word) => {
          return (
            <Box mr={1}>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => selectWordCallback(word)}
              >
                {word}
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
