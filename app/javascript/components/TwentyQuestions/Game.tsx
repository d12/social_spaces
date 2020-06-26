import React, { useEffect, useState } from "react";

import * as styles from "./TwentyQuestions.module.scss";

import SelectingWordStatus from "./SelectingWordStatus.tsx";

interface Props {
  isLeader: boolean;
  status: string;
  leader: number;
  wordOptions: string[];
  clientEventCallback: function;
}

export default function Game({ isLeader, status, leader, wordOptions, clientEventCallback }: Props) {
  function selectWord(word) {
    clientEventCallback("select_word", {word: word})
  }

  switch(status) {
    case "selecting_word_status":
      return <SelectingWordStatus leader={leader}
                                  isLeader={isLeader}
                                  wordOptions={wordOptions}
                                  selectWordCallback={selectWord} />
      break
    default:
      console.log("Loading...")
      return <>Loading...</>
      break
  }
}
