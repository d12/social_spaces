import React, { useEffect, useState } from "react";
import { Cable } from "actioncable";

import * as _styles from "./TwoTruthsOneLie.module.scss";

import consumer from "../../channels/consumer";
import { Brainstorming, Voting } from "./components";

interface Props {
  groupId: string;
  instanceId: number;
  userId: number;
  bootstrapData: GameState;
}

interface User {
  id: number;
  name: string;
  score: number;
  statements: Statement[];
  hasVoted: boolean;
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

export default function TwentyQuestions({
  groupId,
  instanceId,
  userId,
  bootstrapData,
}: Props) {
  const [gameState, setGameState] = useState<GameState>(bootstrapData);
  const [subscription, setSubscription] = useState<Cable>();

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
  }, []);

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
