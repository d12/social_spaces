enum ApiRoutes {
  CREATE_GROUP = "/api/groups/create",
  START_ACTIVITY = "/api/activities/start",
  END_ACTIVITY = "/api/activities/end",
  USER_DATA_FOR_ACTIVITY = "/api/activities/user_data",
  LEAVE_GROUP = "/api/groups/leave",
  JOIN_GROUP = "/api/groups/join",
  GET_GROUP = "/api/groups/",
}

interface UserDataForActivityPayload {
  drawEvents: Array<Array<number>>;
  wordForDrawer: string;
}

export function createGroup() {
  return Post(ApiRoutes.CREATE_GROUP);
}

export function joinGroup(groupKey: string) {
  return Post(ApiRoutes.JOIN_GROUP, { groupKey: groupKey });
}

export function leaveGroup() {
  return Post(ApiRoutes.LEAVE_GROUP);
}

export function startActivity(activity: string) {
  return Post(ApiRoutes.START_ACTIVITY, { activity: activity });
}

export function endActivity(groupKey: string) {
  return Post(ApiRoutes.END_ACTIVITY, { groupKey: groupKey })
}

export function getUserDataForActivity(): Promise<UserDataForActivityPayload> {
  return Get(ApiRoutes.USER_DATA_FOR_ACTIVITY);
}

export function getGroup(groupKey: string) {
  return Get(ApiRoutes.GET_GROUP + groupKey);
}

const APIWrapper = {
  createGroup: createGroup,
  joinGroup: joinGroup,
  leaveGroup: leaveGroup,
  startActivity: startActivity,
  endActivity: endActivity,
  getUserDataForActivity: getUserDataForActivity,
  getGroup: getGroup,
}

export default APIWrapper;

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
  if (body === null || body === undefined)
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
