import React, { useEffect, useState } from "react";

import * as _styles from "./Clicker.module.scss";

import consumer from "../../channels/consumer";

interface BootstrapData {
  count: number;
}

interface Props {
  groupId: string;
  instanceId: number;
  userId: number;
  bootstrapData: BootstrapData;
}

export default function Clicker({
  groupId,
  instanceId,
  userId,
  bootstrapData,
}: Props) {
  const [count, setCount] = useState<number>(0);
  const [subscription, setSubscription] = useState(undefined);

  function add() {
    if (subscription !== undefined) {
      subscription.send({ add: true, userId: userId });
    }
  }

  function bootstrap(data: Object) {
    setCount(data["count"]);
  }

  useEffect(() => {
    setSubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: instanceId },
        {
          received: (data: Object) => {
            console.log("RECIEVED A MESSAGE");
            setCount(data["gameState"]["updatedCount"]);
          },
        }
      )
    );

    bootstrap(bootstrapData);
  }, []);

  return (
    <>
      <p>Clicker</p>
      <button onClick={add}>Click me!</button>
      <p>I've been pressed {count} times.</p>
    </>
  );
}
