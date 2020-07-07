import React, { useEffect, useState } from "react";

import * as _styles from "./TwentyQuestions.module.scss";

import consumer from "../../channels/consumer";

import Game from "./Game";

interface Props {
  groupId: string;
  instanceId: number;
  userId: number;
  bootstrapData: GameState;
}

interface User {
  id: number;
  name: string;
}

export interface GameState {
  status: ActivityStatus;
  leaderIndex: number;
  wordOptions: string[];
  word: string;
  askerIndex: number;
  questionIndex: number;
  users: User[];
  roundEndState: RoundEndState;
}

export enum ClientEvent {
  SELECT_WORD = "select_word",
  ASKED_QUESTION = "asked_question",
  BEGIN_NEXT_ROUND = "begin_next_round",
}

export enum ActivityStatus {
  SELECTING_WORD = "selecting_word",
  ASKING_QUESTIONS = "asking_questions",
  ROUND_END = "round_end",
}

export enum RoundEndState {
  WIN = "win",
  LOSE = "lose",
}

export function leader(gameState: GameState): User {
  return gameState.users[gameState.leaderIndex];
}

export function asker(gameState: GameState): User {
  return gameState.users[gameState.askerIndex];
}

export default function TwentyQuestions({
  groupId,
  instanceId,
  userId,
  bootstrapData,
}: Props) {
  const [gameState, setGameState] = useState<GameState>(undefined);
  const [subscription, setSubscription] = useState(undefined);

  function selectWordCallback(word: string): void {
    subscription.send({
      event: ClientEvent.SELECT_WORD,
      userId: userId,
      word: word,
    });
  }

  function askedQuestionCallback(result: string): void {
    subscription.send({
      event: ClientEvent.ASKED_QUESTION,
      userId: userId,
      result: result,
    });
  }

  function beginNextRoundCallback(): void {
    subscription.send({
      event: ClientEvent.BEGIN_NEXT_ROUND,
      userId: userId,
    });
  }

  useEffect(() => {
    setSubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: instanceId },
        {
          received: (data: GameState) => {
            setGameState(data);
          },
        }
      )
    );

    setGameState(bootstrapData);
  }, []);

  if (gameState === undefined) {
    return <>Loading...</>;
  } else {
    return (
      <>
        <h1>Twenty Questions</h1>
        <Game
          gameState={gameState}
          userId={userId}
          beginNextRoundCallback={beginNextRoundCallback}
          selectWordCallback={selectWordCallback}
          askedQuestionCallback={askedQuestionCallback}
        />
      </>
    );
  }
}
