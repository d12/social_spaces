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
  gameState?: GameState;
  drawEvents: Array<Array<number>>;
  authorId?: number;
  erase?: boolean;
  chatMessage?: ChatMessage;
}

interface ActivityUser {
  id: number;
  name: string;
}

export interface GameState {
  status: ActivityStatus;
  users: Array<ActivityUser>;
  drawingUserIndex: number;
  wordsToChoose: string;
}

export enum StrokeType {
  PAINT = 0,
  ERASE = 1,
  FILL = 2,
}

export interface DrawEvent {
  strokeType: StrokeType;
  strokeColor: number;
  strokeWidth: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

enum ActivityStatus {
  DRAWING = "drawing",
  CHOOSING = "choosing",
}

export interface Event {
  type: string; // Make this "draw" | "erase"
  data?: any;
}

export interface ChatMessage {
  author: string;
  content: string;
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
  const events = useRef<Array<Event>>([]);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);

  useEffect(() => {
    setActivitySubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: group.activity.id },
        {
          received: (message: Message) => {
            if(message.gameState){
              setGameState(message.gameState);
            }

            if(message.chatMessage){
              setMessages(messages => [...messages, message.chatMessage]);
            }

            if(message.authorId == user.id)
              return;

            if(message.drawEvents){
              events.current = [...events.current, ...message.drawEvents.map(drawEvent => {
                return { type: "draw", data: deserializeDrawEvent(drawEvent) }
              })];
            }

            if(message.erase === true) {
              events.current = [...events.current, { type: "erase" }];
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
            console.log(message);
            if(message.drawEvents && message.authorId !== user.id){
              events.current = [...events.current, ...message.drawEvents.map(e => {
                return {type: "draw", data: deserializeDrawEvent(e)}
              })];
            }
          }
        },
      )
    );
  }, []);

  if (!activitySubscription || !gameState) {
    return <p>Loading...</p>;
  }

  return <Drawing user={user} subscription={activitySubscription} gameState={gameState} events={events} messages={messages}/>
}
