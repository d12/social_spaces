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
  event: Event;
  gameState?: GameState;
}

export interface GameState {
  status: ActivityStatus;
}

enum ActivityStatus {
  DRAWING = "drawing",
}

enum Event {
  GAMESTATE_UPDATE = "GAMESTATE_UPDATE",
  DRAW = "DRAW",
}

export default function DrawIt({
  user,
  group,
}: Props) {
  const [gameState, setGameState] = useState<GameState>();
  const [subscription, setSubscription] = useState<Cable>();

  useEffect(() => {
    setSubscription(
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
  }, []);

  if (!subscription || !gameState) {
    return <p>Loading...</p>;
  }

  switch (gameState.status) {
    case ActivityStatus.DRAWING:
      return <Drawing user={user} subscription={subscription} gameState={gameState} />;
  }
}
