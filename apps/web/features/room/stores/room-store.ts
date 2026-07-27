"use client";

import { create } from "zustand";
import { getRoomItemDefinition } from "@/features/room-editor/catalog/item-definitions";
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
  isEditing: boolean;
  selectedItemDefinitionId: string | null;
  selectedObjectId: string | null;
  moveLocalPlayer: (delta: MoveDelta) => void;
  setEditing: (isEditing: boolean) => void;
  selectItemDefinition: (itemDefinitionId: string) => void;
  selectObject: (objectId: string) => void;
  placeSelectionAt: (position: { x: number; y: number }) => void;
  rotateSelectedObject: () => void;
  removeSelectedObject: () => void;
  replaceObjects: (objects: RoomObject[]) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  room: demoRoom,
  localPlayer: demoPlayer,
  objects: demoObjects,
  isEditing: false,
  selectedItemDefinitionId: null,
  selectedObjectId: null,
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
  setEditing: (isEditing) =>
    set({
      isEditing,
      selectedItemDefinitionId: null,
      selectedObjectId: null,
    }),
  selectItemDefinition: (itemDefinitionId) =>
    set((state) => ({
      selectedItemDefinitionId:
        state.selectedItemDefinitionId === itemDefinitionId
          ? null
          : itemDefinitionId,
      selectedObjectId: null,
    })),
  selectObject: (objectId) =>
    set((state) => ({
      selectedItemDefinitionId: null,
      selectedObjectId: state.selectedObjectId === objectId ? null : objectId,
    })),
  placeSelectionAt: (position) =>
    set((state) => {
      if (!state.isEditing) {
        return state;
      }

      const occupied = state.objects.some(
        (object) =>
          object.id !== state.selectedObjectId &&
          object.position.x === position.x &&
          object.position.y === position.y,
      );

      if (occupied) {
        return state;
      }

      if (state.selectedObjectId) {
        return {
          objects: state.objects.map((object) =>
            object.id === state.selectedObjectId
              ? { ...object, position }
              : object,
          ),
        };
      }

      if (!state.selectedItemDefinitionId) {
        return state;
      }

      const definition = getRoomItemDefinition(
        state.selectedItemDefinitionId,
      );

      if (!definition) {
        return state;
      }

      const object: RoomObject = {
        id: `local-${definition.id}-${Date.now()}`,
        roomId: state.room.id,
        itemDefinitionId: definition.id,
        position,
        rotation: 0,
        state: {
          color: definition.color,
          blocksMovement: definition.blocksMovement,
        },
      };

      return {
        objects: [...state.objects, object],
      };
    }),
  rotateSelectedObject: () =>
    set((state) => ({
      objects: state.objects.map((object) =>
        object.id === state.selectedObjectId
          ? { ...object, rotation: (object.rotation + 90) % 360 }
          : object,
      ),
    })),
  removeSelectedObject: () =>
    set((state) => ({
      objects: state.objects.filter(
        (object) => object.id !== state.selectedObjectId,
      ),
      selectedObjectId: null,
    })),
  replaceObjects: (objects) =>
    set({
      objects,
      selectedItemDefinitionId: null,
      selectedObjectId: null,
    }),
}));
