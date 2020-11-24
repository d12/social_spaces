export default function def() {
  console.log("Why do I need a default");
}

export enum ApiRoutes {
  CREATE_GROUP = "/api/groups/create",
  START_ACTIVITY = "/api/activities/start",
  END_ACTIVITY = "/api/activities/end",
  LEAVE_GROUP = "/api/groups/leave",
  JOIN_GROUP = "/api/groups/join",
  GET_GROUP = "/api/groups/",
}

export function CreateGroup() {
  return Post(ApiRoutes.CREATE_GROUP);
}

export function JoinGroup(groupKey: string) {
  return Post(ApiRoutes.JOIN_GROUP, {groupKey: groupKey});
}

export function LeaveGroup() {
  return Post(ApiRoutes.LEAVE_GROUP);
}

export function StartActivity(activity: string) {
  return Post(ApiRoutes.START_ACTIVITY, {activity: activity});
}

export function EndActivity(groupKey: string) {
  return Post(ApiRoutes.END_ACTIVITY, {groupKey: groupKey})
}

export function GetGroup(groupKey: string) {
  return Get(ApiRoutes.GET_GROUP + groupKey);
}

function Get(route: string) {
  return fetch(route, {
    method: "GET",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(response => response.json());
}

function Post(route: ApiRoutes, body?: object) {
  if(body === null || body === undefined)
    body = {}

  return fetch(route, {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(response => response.json());
}
