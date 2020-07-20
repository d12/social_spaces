import React from "react";

import { GameState, asker } from "../../TwentyQuestions";

import { Typography, Box, Button } from "@material-ui/core";

interface Props {
  gameState: GameState;
  askedQuestionCallback(answer: string): void;
}

export default function AskingQuestionsLeaderStatus({
  gameState,
  askedQuestionCallback,
}: Props) {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>
          It's {asker(gameState).name}'s turn to ask you a yes/no question.
        </Typography>
        <Typography variant="h5">Question {gameState.questionIndex}</Typography>
      </Box>
      <Box mt={2}>
        <Typography>
          Once they've asked you a question, select an answer from below:
        </Typography>
      </Box>
      <Box display="flex" mt={2}>
        <Box mr={1}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => askedQuestionCallback("yes")}
          >
            Yes
          </Button>
        </Box>
        <Box mr={1}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => askedQuestionCallback("no")}
          >
            No
          </Button>
        </Box>
        <Box mr={1}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => askedQuestionCallback("correctanswer")}
          >
            You guessed the word!
          </Button>
        </Box>
      </Box>
      <Box mt={2}>
        <Typography>
          Remember, your word is <strong>{gameState.word}</strong>.
        </Typography>
      </Box>
    </Box>
  );
}
