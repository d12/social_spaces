import React, { useEffect, useState } from "react";

import * as _styles from "./Clicker.module.scss";

import consumer from "../../channels/consumer";

import { AppFrame } from "../AppFrame";

interface BootstrapData {
  count: number;
}

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
  bootstrapData: BootstrapData;
  jitsiJwt: string;
}

export default function Clicker({
  users,
  meetUrl,
  groupId,
  instanceId,
  userId,
  bootstrapData,
  jitsiJwt,
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

  const groupTabProps = {
    users,
    meetUrl,
    groupId,
  };

  // return (
  //   <>
  //     <AppFrame noticeToast="" alertToast="" groupTabProps={groupTabProps} jitsiJwt={jitsiJwt}>
  //       <p>Clicker</p>
  //       <button onClick={add}>Click me!</button>
  //       <p>I've been pressed {count} times.</p>
  //     </AppFrame>
  //   </>
  // );
  return;
}
