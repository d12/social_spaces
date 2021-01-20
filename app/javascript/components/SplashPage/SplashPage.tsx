import React from "react";

interface Props {
  groupKey?: string;
}

export default function SplashPage({ groupKey } : Props) {
  const loginUrl = groupKey ? `/login/google/join/${groupKey}` : "/login/google";
  const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");

  return (
    <>
      <h2>Welcome to SocialSpaces.</h2>
      <br />
      <a href={loginUrl}>Login with Google</a>
      <br />
      <br />
      Or, play as a guest.
      <br />
      <form action="/guest_signup" method="post">
        Name:
        <input id="name" name="name" type="textbox"></input>
        <input type="submit" value="Submit"></input>
        <input type="hidden" name="authenticity_token" value={csrf}></input>
        <input type="hidden" name="groupKey" value={groupKey}></input>
      </form>
    </>
  );
}
