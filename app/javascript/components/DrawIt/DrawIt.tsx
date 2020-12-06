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
  authorId?: number;
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

export enum StrokeType {
  PAINT = 0,
  ERASE = 1,
  FILL = 2,
}

export enum StrokeColor {
  BLACK = 0,
}

export interface DrawEvent {
  strokeType: StrokeType;
  strokeColor: StrokeColor;
  strokeWidth: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

enum ActivityStatus {
  DRAWING = "drawing",
}

enum Event {
  DRAW = "DRAW",
}

function deserializeDrawEvent(input: Array<number>) : DrawEvent {
  return {
    strokeType: input[0],
    strokeColor: input[1],
    strokeWidth: input[2],
    x1: input[3],
    y1: input[4],
    x2: input[5],
    y2: input[6],
  };
}

export default function DrawIt({
  user,
  group,
}: Props) {
  const [gameState, setGameState] = useState<GameState>();
  const [activitySubscription, setActivitySubscription] = useState<Cable>();
  const [userSubscription, setUserSubscription] = useState<Cable>();
  const drawEvents = useRef<Array<DrawEvent>>([]);

  useEffect(() => {
    setActivitySubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: group.activity.id },
        {
          received: (message: Message) => {
            if(message.gameState){
              setGameState(message.gameState);
            }

            if(message.drawEvents && message.authorId !== user.id){
              drawEvents.current = [...drawEvents.current, ...message.drawEvents.map(e => deserializeDrawEvent(e))];
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
              drawEvents.current = [...drawEvents.current, ...(message.drawEvents.map(e => deserializeDrawEvent(e)))];
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
      return <Drawing user={user} subscription={activitySubscription} gameState={gameState} drawEvents={drawEvents} />;
  }
}