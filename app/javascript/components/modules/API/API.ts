export default function def() {
  console.log("Why do I need a default");
}

export enum ApiRoutes {
  CREATE_GROUP = "/api/groups/create",
  START_ACTIVITY = "/api/activities/start",
}

export function CreateGroup() {
  return Post(ApiRoutes.CREATE_GROUP);
}

export function StartActivity(activity: string) {
  return Post(ApiRoutes.START_ACTIVITY, {activity: activity});
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
