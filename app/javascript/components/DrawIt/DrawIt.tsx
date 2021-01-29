import React, { useEffect, useState, useRef, useCallback } from "react";
import { Cable } from "actioncable";

import { User, Group } from "../ApplicationRoot";

import createAuthedConsumer from "../../channels/consumer";

import Drawing from "./components/Drawing/Drawing";

import { API } from "../modules/API";

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
  wordForDrawer?: string;
}

interface ActivityUser {
  id: number;
  name: string;
  score: number;
  hasGuessedCurrentWord: boolean;
}

export interface GameState {
  status: ActivityStatus;
  users: Array<ActivityUser>;
  drawingUserIndex: number;
  wordsToChoose: string;
  givenLetters: string;
  roundNumber: number;
  timeTilRoundEnd?: number;
  ranOutOfTime: boolean;
  version: number;
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
  type: "correct" | "guess" | "notice" | "ratelimit" | "winnersmessage";
}

function deserializeDrawEvent(input: Array<number>): DrawEvent {
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
  const [wordForDrawer, setWordForDrawer] = useState<string>();
  const currentVersion = useRef<number>(-1);

  const cachedGameState = useRef<GameState>();

  function shouldSeeWinnersMessages(): boolean {
    const gameState = cachedGameState.current;
    if (!gameState) {
      return false;
    } else if (gameState.users[gameState.drawingUserIndex].id == user.id) {
      // User is drawing, all good
      return true;
    } else if (gameState.users.find(u => u.id == user.id).hasGuessedCurrentWord) {
      // User has guessed word, all good
      return true;
    } else {
      return false;
    }
  }

  async function getUserActivityData() {
    const response = await API.getUserDataForActivity();
    if (response.drawEvents.length > 0) {
      events.current = [...events.current, ...response.drawEvents.map(drawEvent => {
        return { type: "draw", data: deserializeDrawEvent(drawEvent) }
      })];
    }

    if (response.wordForDrawer) {
      setWordForDrawer(response.wordForDrawer);
    }
  }

  useEffect(() => {
    const consumer = createAuthedConsumer(user.wsToken);

    setActivitySubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: group.activity.id },
        {
          received: (message: Message) => {
            if (message.gameState && message.gameState.version > currentVersion.current) {
              setGameState(message.gameState);
              cachedGameState.current = message.gameState;
              currentVersion.current = message.gameState.version;

              if (message.gameState.status == "choosing")
                setWordForDrawer(null);
            }

            if (message.chatMessage) {
              if (message.chatMessage.type === "winnersmessage" && !shouldSeeWinnersMessages())
                return;

              setMessages(messages => [...messages, message.chatMessage]);
            }

            if (message.authorId == user.id)
              return;

            if (message.drawEvents) {
              events.current = [...events.current, ...message.drawEvents.map(drawEvent => {
                return { type: "draw", data: deserializeDrawEvent(drawEvent) }
              })];
            }

            if (message.erase === true) {
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
            if (message.drawEvents && message.authorId !== user.id) {
              events.current = [...events.current, ...message.drawEvents.map(e => {
                return { type: "draw", data: deserializeDrawEvent(e) }
              })];
            }

            if (message.wordForDrawer) {
              setWordForDrawer(message.wordForDrawer);
            }

            if (message.chatMessage) {
              setMessages(messages => [...messages, message.chatMessage]);
            }
          }
        },
      )
    );

    getUserActivityData();
  }, []);

  if (!activitySubscription || !gameState || !gameState.users.find(u => u.id == user.id)) {
    return null;
  }

  return <Drawing user={user} group={group} subscription={activitySubscription} gameState={gameState} events={events} messages={messages} wordForDrawer={wordForDrawer} />
}
