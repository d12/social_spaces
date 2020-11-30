import React from "react";

interface Props {
  groupKey?: string;
}

export default function SplashPage({ groupKey } : Props) {
  const loginUrl = groupKey ? `/login/google/join/${groupKey}` : "/login/google";

  return (
    <>
      <h2>Welcome to SocialSpaces.</h2>
      <br />
      <a href={loginUrl}>Login with Google</a>
    </>
  );
}
