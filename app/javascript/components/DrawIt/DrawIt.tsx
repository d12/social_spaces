import React, { useEffect, useState, useRef } from "react";
import { Cable } from "actioncable";

import { User, Group } from "../ApplicationRoot";

import consumer from "../../channels/consumer";

import Drawing from "./components/Drawing/Drawing";

interface Props {
  user: User;
  group: Group;
}

interface Message {
  event?: Event;
  gameState?: GameState;
  drawEvents: Array<Array<number>>;
}

interface ActivityUser {
  id: number;
  name: string;
}

export interface GameState {
  status: ActivityStatus;
  users: Array<ActivityUser>;
  drawingUserIndex: number;
}

enum ActivityStatus {
  DRAWING = "drawing",
}

enum Event {
  DRAW = "DRAW",
}

export default function DrawIt({
  user,
  group,
}: Props) {
  const [gameState, setGameState] = useState<GameState>();
  const [activitySubscription, setActivitySubscription] = useState<Cable>();
  const [userSubscription, setUserSubscription] = useState<Cable>();

  const drawingRef = useRef();

  useEffect(() => {
    setActivitySubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: group.activity.id },
        {
          received: (message: Message) => {
            if(message.gameState)
              setGameState(message.gameState);

            if(message.drawEvents){
              // Sorry angel
              // @ts-ignore
              drawingRef.current.receiveDrawEvents(message.drawEvents);
            }
          },
        }
      )
    );

    setUserSubscription(
      consumer.subscriptions.create(
        { channel: "UserChannel", user_id: user.id },
        {
          received: (message: Message) => {
            if(message.drawEvents) {
              // Also sorry here
              // @ts-ignore
              window.setTimeout(() => { drawingRef.current.receiveDrawEvents(message.drawEvents)}, 500);
            }
          }
        },
      )
    );
  }, []);

  if (!activitySubscription || !gameState) {
    return <p>Loading...</p>;
  }

  switch (gameState.status) {
    case ActivityStatus.DRAWING:
      return <Drawing user={user} subscription={activitySubscription} gameState={gameState} ref={drawingRef} />;
  }
}
