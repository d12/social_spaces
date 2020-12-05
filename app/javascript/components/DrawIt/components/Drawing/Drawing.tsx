import React from "react";
import { Cable } from "actioncable";

import { User } from "../../../ApplicationRoot";
import { GameState } from "../../DrawIt";

export interface Props {
  user: User;
  subscription: Cable;
  gameState: GameState;
}

export default function Drawing({ user, subscription, gameState }: Props) {
  return (
    <>
      Yo I'm drawing
    </>
  );
}
