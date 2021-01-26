import React, { useEffect, useState } from "react";
import { Cable } from "actioncable";

import { User, Group } from "../ApplicationRoot";

import * as _styles from "./TwoTruthsOneLie.module.scss";

import createAuthedConsumer from "../../channels/consumer";
import { Brainstorming, Voting, Summary, WaitingToStart } from "./components";

interface Props {
  user: User;
  group: Group;
}

export interface ActivityUser {
  id: number;
  name: string;
  score: number;
  statements: Statement[];
  hasVoted: boolean;
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
  users: ActivityUser[];
  roundCount: number;
}

enum ActivityStatus {
  WAITING_TO_START = "waiting_to_start",
  BRAINSTORMING = "brainstorming",
  VOTING = "voting",
  SUMMARY = "summary",
}

enum Event {
  ACTIVITY_END = "ACTIVITY_END",
}

export function CurrentUserData(gameState: GameState, id: number): ActivityUser {
  return gameState.users.filter(function (u) { return u.id == id })[0];
}

export default function TwentyQuestions({
  user,
  group,
}: Props) {
  const [gameState, setGameState] = useState<GameState>();
  const [subscription, setSubscription] = useState<Cable>();

  useEffect(() => {
    const consumer = createAuthedConsumer(user.wsToken);

    setSubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: group.activity.id },
        {
          received: (data: Message) => {
            setGameState(data.gameState);
          },
        }
      )
    );
  }, []);

  if (!subscription || !gameState) {
    return <p>Loading...</p>;
  }

  const currentUserData: ActivityUser = gameState.users.filter(function (u) { return u.id == user.id })[0];

  switch (gameState.status) {
    case ActivityStatus.WAITING_TO_START:

      return (
        <WaitingToStart
          userId={user.id}
          subscription={subscription}
          gameState={gameState}
          group={group}
        />
      );
    case ActivityStatus.BRAINSTORMING:
      return (
        <Brainstorming
          userId={user.id}
          subscription={subscription}
          gameState={gameState}
          currentUserData={currentUserData}
        />
      );
    case ActivityStatus.VOTING:
      return (
        <Voting
          userId={user.id}
          subscription={subscription}
          gameState={gameState}
          currentUserData={currentUserData}
        />
      );
    case ActivityStatus.SUMMARY:
      return (
        <Summary
          userId={user.id}
          subscription={subscription}
          gameState={gameState}
        />
      );
  }
}
