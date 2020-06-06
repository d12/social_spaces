import React from "react";

interface Props {
  userName: string;
}

export default function Greeting({ userName }: Props) {
  return <h2>Hello {userName}! Welcome to SocialSpaces</h2>;
}
