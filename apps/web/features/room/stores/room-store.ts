"use client";

import { create } from "zustand";
import type { Player, PlayerDirection, Room, RoomObject } from "../types";

const demoRoom: Room = {
  id: "demo",
  name: "Demo Room",
  width: 16,
  height: 10,
  tileSize: 48,
  isPublic: true,
};

const demoPlayer: Player = {
  id: "local-player",
  roomId: demoRoom.id,
  name: "Local Player",
  avatarConfig: {
    bodyColor: "#38bdf8",
    accentColor: "#0f172a",
    displayName: "You",
  },
  position: { x: 4, y: 4 },
  direction: "down",
};

const demoObjects: RoomObject[] = [
  {
    id: "demo-table",
    roomId: demoRoom.id,
    itemDefinitionId: "table",
    label: "Planning table",
    position: { x: 8, y: 4 },
    rotation: 0,
    state: { color: "#f59e0b" },
  },
  {
    id: "demo-board",
    roomId: demoRoom.id,
    itemDefinitionId: "whiteboard",
    label: "Retro board",
    position: { x: 12, y: 2 },
    rotation: 0,
    state: { color: "#f8fafc" },
  },
];

type MoveDelta = {
  dx: number;
  dy: number;
  direction: PlayerDirection;
};

type RoomState = {
  room: Room;
  localPlayer: Player;
  objects: RoomObject[];
  moveLocalPlayer: (delta: MoveDelta) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  room: demoRoom,
  localPlayer: demoPlayer,
  objects: demoObjects,
  moveLocalPlayer: ({ dx, dy, direction }) =>
    set((state) => {
      const nextX = Math.max(
        0,
        Math.min(state.room.width - 1, state.localPlayer.position.x + dx),
      );
      const nextY = Math.max(
        0,
        Math.min(state.room.height - 1, state.localPlayer.position.y + dy),
      );

      return {
        localPlayer: {
          ...state.localPlayer,
          direction,
          position: {
            x: nextX,
            y: nextY,
          },
        },
      };
    }),
}));
