import React, { useEffect, useState } from "react";

import * as styles from "./TwentyQuestions.module.scss";

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

export default function TwentyQuestions({ groupKey, instanceId, userId, bootstrapData }: Props) {
  const [count, setCount] = useState<number>(0);
  const [subscription, setSubscription] = useState();

  function add() {
    subscription.send({ add: true, userId: userId });
  }

  function bootstrap(data) {
    setCount(data["count"])
  }

  useEffect(() => {
    setSubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: instanceId },
        {
          received: (data) => {
            console.log("RECIEVED A MESSAGE");
            setCount(data["updatedCount"]);
          },
        }
      )
    );

    bootstrap(bootstrapData);
  }, []);

  return (
    <>
      <p>Twenty Questions</p>
      <button onClick={add}>Click me!</button>
      <p>I've been pressed {count} times.</p>
    </>
  );
}
