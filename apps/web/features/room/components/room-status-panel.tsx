"use client";

import { useRoomStore } from "../stores/room-store";

export function RoomStatusPanel() {
  const room = useRoomStore((state) => state.room);
  const player = useRoomStore((state) => state.localPlayer);

  return (
    <aside className="rounded-md border bg-card p-4 text-sm shadow-sm">
      <h2 className="text-base font-semibold">{room.name}</h2>
      <dl className="mt-3 grid gap-2 text-muted-foreground">
        <div className="flex justify-between gap-3">
          <dt>Player</dt>
          <dd className="font-medium text-foreground">{player.name}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Position</dt>
          <dd className="font-medium text-foreground">
            {player.position.x}, {player.position.y}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Direction</dt>
          <dd className="font-medium capitalize text-foreground">
            {player.direction}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
