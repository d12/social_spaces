import React, { useEffect, useState } from "react";
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
  data: any;
}

export interface GameState {
  status: ActivityStatus;
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

  useEffect(() => {
    setActivitySubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: group.activity.id },
        {
          received: (message: Message) => {
            if(message.gameState)
              setGameState(message.gameState);
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
      return <Drawing user={user} subscription={activitySubscription} gameState={gameState} />;
  }
}
