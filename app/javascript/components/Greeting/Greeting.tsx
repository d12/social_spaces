import React from "react";

import { yam } from "../../images";
import * as styles from "./Greeting.module.scss";

interface Props {
  userName: string;
}

export default function Greeting({ userName }: Props) {
  return (
    <>
      <h2 className={styles.Greeting}>Hello {userName}!</h2>
      <img src={yam} />
    </>
  );
}
