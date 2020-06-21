import React, { useEffect, useState } from "react";

import * as styles from "./TwentyQuestions.module.scss";

import consumer from "../../channels/consumer";

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

export default function TwentyQuestions({ groupKey, instanceId, userId, bootstrapData }: Props) {
  const [text, setText] = useState<string>("");
  const [subscription, setSubscription] = useState();

  function selectWord(word) {
    subscription.send({ action: "select_word", userId: userId, word: word});
  }

  function bootstrap(data) {
    console.log("bootstrapping")
    acceptMessage(data)
  }

  function acceptMessage(data){
    if(data["status"] == "selecting_word"){
      if(data["leader"] == userId){
        console.log("I'm the leader!")
        setText(
          <>
            <p>Please select a word</p>
            {data["word_options"].map((word, index) => {
              return <button key={word} onClick={() => selectWord(word)}>{word}</button>
            })}
          </>
        )
      }
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

    bootstrap(bootstrapData);
  }, []);

  return (
    <>
      <p>Twenty Questions</p>
      {text}
    </>
  );
}
