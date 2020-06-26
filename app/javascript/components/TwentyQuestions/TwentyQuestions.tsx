import React, { useEffect, useState } from "react";

import * as _styles from "./TwentyQuestions.module.scss";

import consumer from "../../channels/consumer";

import Game from "./Game";

interface BootstrapData {
  status: string;
  leader: number;
  wordOptions: string[];
}

interface Props {
  groupId: string;
  instanceId: number;
  userId: number;
  bootstrapData: BootstrapData;
}

export default function TwentyQuestions({ groupId, instanceId, userId, bootstrapData }: Props) {
  const [status, setStatus] = useState(undefined);
  const [leader, setLeader] = useState(undefined);
  const [wordOptions, setWordOptions] = useState(undefined);
  const [subscription, setSubscription] = useState(undefined);

  function acceptMessage(data){
    console.log("Accepted message!")
    console.log(data);

    setStatus(data["status"])
    setLeader(data["leader"])
    setWordOptions(data["word_options"])
  }

  // A callback used by client-side components when we need to update state
  // or send requests to the server.
  function clientEvent(event: String, data){
    switch(event){
      case "select_word":
        subscription.send({ event: "select_word", userId: userId, word: data.word });
        break

      default:
        console.log("Unknown event: " + event)
        break
    }
  }

  useEffect(() => {
    setSubscription(
      consumer.subscriptions.create(
        { channel: "ActivityChannel", activity_instance_id: instanceId },
        {
          received: (data) => {
            console.log("RECIEVED A MESSAGE");
          },
        }
      )
    );

    acceptMessage(bootstrapData);
  }, []);

  return (
    <>
      <h1>Twenty Questions</h1>
      <Game status={status}
            leader={leader}
            isLeader={userId === leader}
            wordOptions={wordOptions}
            clientEventCallback={clientEvent} />
    </>
  )
}
