import React from "react";

import * as _styles from "./TwentyQuestions.module.scss";

import SelectingWordStatus from "./SelectingWordStatus";

import SelectingWordLeaderStatus from "./Statuses/SelectingWord/LeaderStatus";
import SelectingWordFollowerStatus from "./Statuses/SelectingWord/FollowerStatus";

import AskingQuestionsLeaderStatus from "./Statuses/AskingQuestions/LeaderStatus";
import AskingQuestionsAskerStatus from "./Statuses/AskingQuestions/AskerStatus";
import AskingQuestionsWaiterStatus from "./Statuses/AskingQuestions/WaiterStatus";

import RoundEndLeaderStatus from "./Statuses/RoundEnd/LeaderStatus";
import RoundEndFollowerStatus from "./Statuses/RoundEnd/FollowerStatus";

import { GameState, ActivityStatus, leader, asker } from "./TwentyQuestions";

interface Props {
  gameState: GameState;
  userId: number;
  selectWordCallback(word: string): void;
  askedQuestionCallback(result: string): void;
  beginNextRoundCallback(): void;
}

export default function Game({
  gameState,
  userId,
  selectWordCallback,
  askedQuestionCallback,
  beginNextRoundCallback,
}: Props) {
  const isLeader = userId === leader(gameState).id;

  switch (gameState.status) {
    case ActivityStatus.SELECTING_WORD:
      if (isLeader) {
        return (
          <SelectingWordLeaderStatus
            gameState={gameState}
            selectWordCallback={selectWordCallback}
          />
        );
      } else {
        return <SelectingWordFollowerStatus gameState={gameState} />;
      }
    case ActivityStatus.ASKING_QUESTIONS:
      if (isLeader) {
        return (
          <AskingQuestionsLeaderStatus
            gameState={gameState}
            askedQuestionCallback={askedQuestionCallback}
          />
        );
      }

      const isAsking = userId === asker(gameState).id;

      if (isAsking) {
        return <AskingQuestionsAskerStatus gameState={gameState} />;
      } else {
        return <AskingQuestionsWaiterStatus gameState={gameState} />;
      }
    case ActivityStatus.ROUND_END:
      if (isLeader) {
        return (
          <RoundEndLeaderStatus
            gameState={gameState}
            beginNextRoundCallback={beginNextRoundCallback}
          />
        );
      } else {
        return <RoundEndFollowerStatus gameState={gameState} />;
      }

    default:
      return <p>Loading...</p>;
  }
}
