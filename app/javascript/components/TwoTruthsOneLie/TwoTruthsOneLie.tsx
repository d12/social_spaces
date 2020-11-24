import React, { useEffect, useState } from "react";
import { Cable } from "actioncable";

import * as _styles from "./TwoTruthsOneLie.module.scss";

import consumer from "../../channels/consumer";
import { Brainstorming, Voting } from "./components";
import { AppFrame } from "../AppFrame";

interface Props {
  groupId: string;
  meetUrl: string;
  users: GroupUser[];
  instanceId: number;
  userId: number;
  bootstrapData: GameState;
  jitsiJwt: string;
}

interface User {
  id: number;
  name: string;
  score: number;
  statements: Statement[];
  hasVoted: boolean;
}

interface GroupUser {
  id: number;
  name: string;
  email: string;
  gravatarUrl: string;
}

interface Message {
  event: Event;
  gameState: GameState;
}

interface Statement {
  isLie: boolean;
  content: string;
  voters: number[];
}

export interface GameState {
  status: ActivityStatus;
  leaderIndex: number;
  whosTurnIndex: number;
  users: User[];
}

enum ActivityStatus {
  BRAINSTORMING = "brainstorming",
  VOTING = "voting",
  REVEAL = "reveal",
  SUMMARY = "summary",
}

enum Event {
  ACTIVITY_END = "ACTIVITY_END",
}

function handleEvent(event: Event): void {
  switch (event) {
    case Event.ACTIVITY_END:
      window.location.replace("/activities");
      break;
  }
}

function gameMarkup(gameState: GameState, userId: number, subscription: Cable) {
  if (!subscription) {
    return <p>Loading...</p>;
  }

  switch (gameState.status) {
    case ActivityStatus.BRAINSTORMING:
      return <Brainstorming userId={userId} subscription={subscription} />;
    case ActivityStatus.VOTING:
      return (
        <Voting
          userId={userId}
          subscription={subscription}
          gameState={gameState}
        />
      );
    case ActivityStatus.REVEAL:
      return <p>Something</p>;
    case ActivityStatus.SUMMARY:
      return <p>Something</p>;
  }
}

export default function TwentyQuestions({
  groupId,
  instanceId,
  userId,
  bootstrapData,
  users,
  meetUrl,
  jitsiJwt,
}: Props) {
  const [gameState, setGameState] = useState<GameState>(bootstrapData);
  const [subscription, setSubscription] = useState<Cable>();

  useEffect(() => {
    setSubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: instanceId },
        {
          received: (data: Message) => {
            if (data.event) {
              handleEvent(data.event);
            } else {
              setGameState(data.gameState);
            }
          },
        }
      )
    );
  }, []);

  const groupTabProps = {
    users,
    groupId,
    meetUrl,
  };

  const markup = gameMarkup(gameState, userId, subscription);
  // return (
  //   <AppFrame alertToast="" noticeToast="" groupTabProps={groupTabProps} jitsiJwt={jitsiJwt}>
  //     {markup}
  //   </AppFrame>
  // );
  return;
}
