import React , { useState } from "react";

import GroupIndex from "../GroupIndex";
import ActivityIndex from "../ActivityIndex";

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
}

export interface Activity {
  displayName: string;
  maxUsers: number;
  name: string;
}

interface Props {
  user: User;
  group: Group;
  activity: Activity;
  allActivities: Activity[];
}

export default function ApplicationRoot(props: Props) {
  const [group, setGroup] = useState<Group>(props.group);
  const [user, setUser] = useState<User>(props.user);
  const [activity, setActivity] = useState<Activity>(props.activity);

  if(group === null) {
    return <GroupIndex setGroupCallback={setGroup} user={user} />
  }

  console.log(activity);

  if(activity === null) {
    return <ActivityIndex user={user} group={group} activities={props.allActivities} setActivityCallback={setActivity} />
  }

  return (
    <>

    </>
  );
}
