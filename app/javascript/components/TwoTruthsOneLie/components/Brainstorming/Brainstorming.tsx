import React, { useState } from "react";
import { Cable } from "actioncable";
import {
  useForm,
  useField,
  submitSuccess,
  notEmpty,
  notEmptyString,
} from "@shopify/react-form";

import { ClientEvent } from "../../subscription-manager";

import { GameState, ActivityUser } from "../../TwoTruthsOneLie";

export interface Props {
  userId: number;
  subscription: Cable;
  gameState: GameState;
  currentUserData: ActivityUser;
}

export function Brainstorming({ userId, subscription, gameState, currentUserData }: Props) {
  const requiredErrorMessage = "This field is required";
  const required = [
    notEmpty(requiredErrorMessage),
    notEmptyString(requiredErrorMessage),
  ];

  const { fields, submit, dirty, reset } = useForm({
    fields: {
      firstTruth: useField<string>({ value: "", validates: required }),
      secondTruth: useField<string>({ value: "", validates: required }),
      lie: useField<string>({ value: "", validates: required }),
    },
    onSubmit: async ({ firstTruth, secondTruth, lie }) => {
      submitStatements([firstTruth, secondTruth, lie]);
      return submitSuccess();
    },
  });

  if (currentUserData.statements != null) {
    return <p>Waiting for other players to finish...</p>;
  }

  return (
    <>

    </>
  );

  function submitStatements(statements: string[]): void {
    const lie = statements[2];
    const truths = statements.slice(0, 2);

    subscription.send({
      event: ClientEvent.ENTERED_STATEMENTS,
      userId,
      truths,
      lie,
    });
  }
}
