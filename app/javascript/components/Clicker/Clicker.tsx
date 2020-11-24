import React, { useEffect, useState } from "react";

import * as _styles from "./Clicker.module.scss";

import consumer from "../../channels/consumer";

import { User, Group } from "../ApplicationRoot";

import { EndActivity } from "../modules/API";

interface Props {
  user: User;
  group: Group;
}

export default function Clicker({
  user,
  group
}: Props) {
  const [count, setCount] = useState<number>(0);
  const [subscription, setSubscription] = useState(undefined);

  function add() {
    if (subscription !== undefined) {
      subscription.send({ add: true, userId: user.id });
    }
  }

  useEffect(() => {
    setSubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: group.activity.id },
        {
          received: (data: Object) => {
            setCount(data["gameState"]["count"]);
          },
        }
      )
    );
  }, []);

  const leaveMarkup = user.id === group.hostId ? (<><button onClick={end}>End Activity</button></>) : null;

  return (
    <>
      <p>Clicker</p>
      <button onClick={add}>Click me!</button>
      <p>I've been pressed {count} times.</p>
      <br></br>
      {leaveMarkup}
    </>
  );

  async function end() {
    await EndActivity(group.key);
    console.log("Ended activity.");
  }
}
