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
  const [submitted, setSubmitted] = useState(false);

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
      <h2>Brainstorming - Enter two truths and one lie.</h2>
      <br />
      <form onSubmit={submit}>
        <div>
          <label htmlFor="firstTruth">
            Truth #1
            <input
              id="firstTruth"
              name="firstTruth"
              value={fields.firstTruth.value}
              onChange={fields.firstTruth.onChange}
              onBlur={fields.firstTruth.onBlur}
              autoComplete="off"
            />
          </label>
          {fields.firstTruth.error && (
            <p className="error">{fields.firstTruth.error}</p>
          )}
        </div>
        <div>
          <label htmlFor="secondTruth">
            Truth #2
            <input
              id="secondTruth"
              name="secondTruth"
              value={fields.secondTruth.value}
              onChange={fields.secondTruth.onChange}
              onBlur={fields.secondTruth.onBlur}
              autoComplete="off"
            />
          </label>
          {fields.secondTruth.error && (
            <p className="error">{fields.secondTruth.error}</p>
          )}
        </div>
        <div>
          <label htmlFor="lie">
            Lie
            <input
              id="lie"
              name="lie"
              value={fields.lie.value}
              onChange={fields.lie.onChange}
              onBlur={fields.lie.onBlur}
              autoComplete="off"
            />
          </label>
          {fields.lie.error && <p className="error">{fields.lie.error}</p>}
        </div>
        <br />
        <button type="button" disabled={!dirty} onClick={reset}>
          Reset
        </button>
        <button type="submit" disabled={!dirty} onClick={submit}>
          Submit
        </button>
      </form>
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
