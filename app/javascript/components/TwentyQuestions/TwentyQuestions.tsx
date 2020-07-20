import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Typography, Button, IconButton } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { AppFrame } from "../AppFrame";

import consumer from "../../channels/consumer";

import Game from "./Game";

interface Props {
  meetUrl: string;
  users: GroupUser[];
  groupId: string;
  instanceId: number;
  userId: number;
  bootstrapData: GameState;
}

interface User {
  id: number;
  name: string;
}

interface GroupUser {
  id: number;
  name: string;
  email: string;
  gravatarUrl: string;
}

interface Message {
  event: Event;
  message: String;
  gameState: GameState;
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

enum Event {
  ACTIVITY_END = "ACTIVITY_END",
}

export function leader(gameState: GameState): User {
  return gameState.users[gameState.leaderIndex];
}

export function asker(gameState: GameState): User {
  return gameState.users[gameState.askerIndex];
}

export default function TwentyQuestions({
  instanceId,
  userId,
  bootstrapData,
  users,
  meetUrl,
  groupId,
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

  function handleEvent(event: Event, message: String): void {
    switch (event) {
      case Event.ACTIVITY_END:
        window.location.replace(`/activities?reason=${message}`);
        break;
    }
  }

  useEffect(() => {
    setSubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: instanceId },
        {
          received: (data: Message) => {
            if (data.event) {
              handleEvent(data.event, data.message);
            } else {
              setGameState(data.gameState);
            }
          },
        }
      )
    );

    setGameState(bootstrapData);
  }, []);

  const groupTabProps = {
    users,
    groupId,
    meetUrl,
  };

  if (gameState === undefined) {
    return <>Loading...</>;
  } else {
    return (
      <>
        <AppFrame noticeToast="" alertToast="" groupTabProps={groupTabProps}>
          <h1>Twenty Questions</h1>
          <Game
            gameState={gameState}
            userId={userId}
            beginNextRoundCallback={beginNextRoundCallback}
            selectWordCallback={selectWordCallback}
            askedQuestionCallback={askedQuestionCallback}
          />
        </AppFrame>
      </>
    );
  }
}
