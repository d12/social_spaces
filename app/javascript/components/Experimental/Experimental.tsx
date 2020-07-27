import React, { useEffect, useState } from "react";

import consumer from "../../channels/consumer";

import { AppFrame } from "../AppFrame";

import PlayingCardHand, {
  PlayingCard,
  CardSuit,
  CardSize,
} from "../PlayingCard";

import { Typography } from "@material-ui/core";

interface GameState {}

interface GroupUser {
  id: number;
  name: string;
  email: string;
  gravatarUrl: string;
}

interface Props {
  meetUrl: string;
  users: GroupUser[];
  groupId: string;
  instanceId: number;
  userId: number;
  bootstrapData: GameState;
}

export default function Experimental({
  users,
  meetUrl,
  groupId,
  instanceId,
  userId,
  bootstrapData,
}: Props) {
  const [subscription, setSubscription] = useState(undefined);
  const [gameState, setGameState] = useState<GameState>(undefined);
  const [cards, setCards] = useState(undefined);
  const [flipped, setFlipped] = useState(true);

  useEffect(() => {
    setSubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: instanceId },
        {
          received: (data: Object) => {
            console.log("RECIEVED A MESSAGE");
            console.log(data);
          },
        }
      )
    );

    setGameState(bootstrapData);
    setCards([
      { number: "10", suit: CardSuit.Heart, faceDown: true },
      { number: "J", suit: CardSuit.Diamond, faceDown: true },
      { number: "Q", suit: CardSuit.Spade, faceDown: true },
      { number: "K", suit: CardSuit.Heart, faceDown: true },
      { number: "A", suit: CardSuit.Heart, faceDown: true },
    ]);
  }, []);

  const groupTabProps = {
    users,
    meetUrl,
    groupId,
  };

  function buttonFunction() {
    if (flipped) {
      setCards([
        { number: "10", suit: CardSuit.Heart },
        { number: "J", suit: CardSuit.Diamond },
        { number: "Q", suit: CardSuit.Spade },
        { number: "K", suit: CardSuit.Heart },
        { number: "A", suit: CardSuit.Heart },
      ]);
    } else {
      setCards([
        { number: "10", suit: CardSuit.Heart, faceDown: true },
        { number: "J", suit: CardSuit.Diamond, faceDown: true },
        { number: "Q", suit: CardSuit.Spade, faceDown: true },
        { number: "K", suit: CardSuit.Heart, faceDown: true },
        { number: "A", suit: CardSuit.Heart, faceDown: true },
      ]);
    }

    setFlipped(!flipped);
  }

  return (
    <AppFrame noticeToast="" alertToast="" groupTabProps={groupTabProps}>
      <PlayingCardHand cards={cards} size={CardSize.Medium} />
      <button onClick={buttonFunction}>Click me</button>
    </AppFrame>
  );
}
