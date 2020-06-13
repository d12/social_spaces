import React, { useEffect, useState } from "react";

import * as styles from "./GroupChat.module.scss";

import consumer from "../../channels/consumer";

interface Props {
  groupId: string;
}

export default function GroupChat({ groupId }: Props) {
  const [messages, setMessages] = useState<string[]>([]);
  const [groupChannel, setGroupChannel] = useState<any>();

  useEffect(() => {
    console.log(groupId);
    const groupChannel = consumer.subscriptions.create(
      { channel: "GroupChannel", group_id: groupId },
      {
        received: (data) => {
          console.log(data);
          setMessages((messages) => {
            return [...messages, data.message];
          });
        },
      }
    );

    setTimeout(() => {
      groupChannel.send({ message: "HELLO WORLD. YAMS?" });
    }, 5000);

    setGroupChannel(groupChannel);
  }, []);

  return (
    <>
      <p>Messages sent from people in this group:</p>
      {messages.map((message) => (
        <p>{message}</p>
      ))}
    </>
  );
}
