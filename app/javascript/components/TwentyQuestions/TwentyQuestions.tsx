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
  status: string;
  leaderIndex: number;
  wordOptions: string[];
  word: string;
  askerIndex: number;
  questionIndex: number;
  users: User[];
}

export enum ClientEvent {
  SELECT_WORD,
  ASKED_QUESTION,
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

  // A callback used by client-side components when we need to update state
  // or send requests to the server.
  function clientEvent(event: ClientEvent, data) {
    switch (event) {
      case ClientEvent.SELECT_WORD:
        subscription.send({ event: event, userId: userId, word: data.word });
        break;

      case ClientEvent.ASKED_QUESTION:
        subscription.send({
          event: event,
          userId: userId,
          result: data.result,
        });
        break;

      default:
        console.log("Unknown event: " + event);
        break;
    }
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
          clientEventCallback={clientEvent}
        />
      </>
    );
  }
}
