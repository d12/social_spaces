import React, { useEffect, useState } from "react";

export default function JoinGroup() {
  const [groupId, setGroupId] = useState<string>('');

  function onInputChange(e) {
    setGroupId(e.target.value);
  }

  return (
    <>
      <input type="text" value={groupId} onChange={onInputChange} />
      <a href={ `/join/${groupId}` }>Join Game</a>
    </>
  );
}
