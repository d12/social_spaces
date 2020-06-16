import React, { useEffect, useState } from "react";

import * as styles from "./GroupMembers.module.scss";

import consumer from "../../channels/consumer";

interface User {
  id: number;
  name: string;
}

interface Props {
  groupId: string;
  initialUsers: User[];
}

export default function GroupMembers({ groupId, initialUsers }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  function addUser(user: User): void {
    setUsers((prevUsers) => [...prevUsers, user])
  }

  function removeUser(user: User): void {
    const i = users.findIndex(currentUser => user.id === currentUser.id);
    setUsers([...users.slice(0, i), ...users.slice(i + 1)]);
  }

  useEffect(() => {
    consumer.subscriptions.create(
      { channel: "GroupChannel", group_id: groupId },
      {
        received: ({ type, user }) => {
          switch (type) {
            case "JOINED":
              addUser(user);
              break;
            case "LEFT":
              removeUser(user);
              break;
            default:
              console.error("Unexpected message");
          }
        },
      }
    );
  }, []);

  return (
    <>
      <p>Group Members</p>
      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </>
  );
}
