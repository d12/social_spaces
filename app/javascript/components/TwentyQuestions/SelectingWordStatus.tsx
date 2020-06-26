import React, { useEffect, useState } from "react";

import * as styles from "./TwentyQuestions.module.scss";

interface Props {
  leader: number
  isLeader: boolean
  wordOptions: string[]
  selectWordCallback: function
}

export default function SelectingWordStatus({ leader, isLeader, wordOptions, selectWordCallback }: Props) {
  if(isLeader){
    return(
      <>
        <h3>Please select a word:</h3>
        {wordOptions.map((word, index) => {
          return <button key={word} onClick={()=> selectWordCallback(word)}>{word}</button>;
        })}
      </>
    )
  } else{
    return <> <h3>Please wait for the leader to choose a word</h3> </>
  }
}
