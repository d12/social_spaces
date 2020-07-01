import React from "react";

import * as _styles from "./TwentyQuestions.module.scss";

import SelectingWordStatus from "./SelectingWordStatus";

import AskingQuestionsLeaderStatus from "./Statuses/AskingQuestions/LeaderStatus";
import AskingQuestionsAskerStatus from "./Statuses/AskingQuestions/AskerStatus";
import AskingQuestionsWaiterStatus from "./Statuses/AskingQuestions/WaiterStatus";

import {
  GameState,
  ClientEvent,
  ActivityStatus,
  leader,
  asker,
} from "./TwentyQuestions";

interface Props {
  gameState: GameState;
  userId: number;
  clientEventCallback(event: ClientEvent, data: Object): void;
}

export default function Game({
  gameState,
  userId,
  clientEventCallback,
}: Props) {
  function selectWord(word: string) {
    clientEventCallback(ClientEvent.SELECT_WORD, { word: word });
  }

  function askedQuestion(result: string) {
    clientEventCallback(ClientEvent.ASKED_QUESTION, { result: result });
  }

  const isLeader = userId === leader(gameState).id;

  switch (gameState.status) {
    case ActivityStatus.SELECTING_WORD:
      return (
        <SelectingWordStatus
          gameState={gameState}
          isLeader={isLeader}
          selectWordCallback={selectWord}
        />
      );
    case ActivityStatus.ASKING_QUESTIONS:
      if (isLeader) {
        return (
          <AskingQuestionsLeaderStatus
            gameState={gameState}
            askedQuestionCallback={askedQuestion}
          />
        );
      }

      const isAsking = userId === asker(gameState).id;

      if (isAsking) {
        return <AskingQuestionsAskerStatus gameState={gameState} />;
      } else {
        return <AskingQuestionsWaiterStatus gameState={gameState} />;
      }

    default:
      return <p>Loading...</p>;
  }
}
