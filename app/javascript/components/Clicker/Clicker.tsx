import React, { useEffect, useState } from "react";

import * as _styles from "./Clicker.module.scss";

import createAuthedConsumer from "../../channels/consumer";

import { User, Group } from "../ApplicationRoot";

import { API } from "../modules/API";

interface Props {
  user: User;
  group: Group;
}

export default function Clicker({
  user,
  group,
}: Props) {
  const [count, setCount] = useState<number>(0);
  const [subscription, setSubscription] = useState(undefined);

  function add() {
    if (subscription !== undefined) {
      subscription.send({ add: true, userId: user.id });
    }
  }

  useEffect(() => {
    const consumer = createAuthedConsumer(user.wsToken);

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

  return (
    <>
      <h2>Clicker</h2>
      <br />
      <button onClick={add}>{count} clicks</button>
    </>
  );
}
