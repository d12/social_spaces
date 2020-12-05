import React , { useState } from "react";

import SplashPage from "../SplashPage";

import GroupIndex from "../GroupIndex";
import ActivityIndex from "../ActivityIndex";

import { AppFrame } from "../AppFrame";

import Clicker from "../Clicker";
import TwoTruthsOneLie from "../TwoTruthsOneLie";
import DrawIt from "../DrawIt";

export interface User {
  id: number;
  name: string;
  email: string;
  gravatarUrl: string;
  jitsiJwt?: string;
}

export interface Group {
  key: string;
  hostId: number;
  users: User[];
  activity?: Activity;
}

export interface Activity {
  displayName: string;
  description: string;
  maxUsers: number;
  name: string;
  id?: number;
}

interface Props {
  groupKey?: string;
  user: User;
  group: Group;
  allActivities: Activity[];
}

export default function ApplicationRoot(props: Props) {
  const [group, setGroup] = useState<Group>(props.group);
  const [user] = useState<User>(props.user);

  function withAppFrame(markup: JSX.Element) {
    return (
      <AppFrame user={user} group={group} setGroupCallback={setGroup}>
        {markup}
      </AppFrame>
    );
  }

  if(user === undefined || user === null) {
    return <SplashPage groupKey={props.groupKey} />
  }

  if(group === undefined || group === null) {
    return <GroupIndex setGroupCallback={setGroup} user={user} />
  }

  if(group.activity === undefined || group.activity === null) {
    return withAppFrame(<ActivityIndex user={user} activities={props.allActivities} setGroupCallback={setGroup} />);
  }

  switch(group.activity.name) {
    case "Clicker":
      return withAppFrame(<Clicker user={user} group={group} />);

    case "TwoTruthsOneLie":
      return withAppFrame(<TwoTruthsOneLie user={user} group={group} />);

    case "DrawIt":
      return withAppFrame(<DrawIt user={user} group={group} />);

    default:
      return `No activity markup for ${name}`;
  }
}
