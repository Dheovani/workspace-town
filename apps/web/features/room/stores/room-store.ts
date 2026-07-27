"use client";

import { create } from "zustand";
import {
  getRoomItemDefinition,
  roomItemDefinitions,
} from "@/features/room-editor/catalog/item-definitions";
import {
  resolvePlayerMovement,
  type PlayerMove,
} from "../domain/player-movement";
import type { AvatarConfig, Player, Room, RoomObject } from "../types";

const demoRoom: Room = {
  id: "demo",
  name: "Demo Room",
  width: 32,
  height: 20,
  tileSize: 48,
  isPublic: true,
};

const demoPlayer: Player = {
  id: "local-player",
  roomId: demoRoom.id,
  name: "Local Player",
  avatarConfig: {
    skinTone: "#d49a6a",
    hairStyle: "spiky",
    hairColor: "#1f2937",
    faceStyle: "smile",
    shirtStyle: "hoodie",
    shirtColor: "#38bdf8",
    pantsColor: "#334155",
    shoeColor: "#f8fafc",
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

type RoomState = {
  room: Room;
  localPlayer: Player;
  objects: RoomObject[];
  isEditing: boolean;
  selectedItemDefinitionId: string | null;
  selectedObjectId: string | null;
  moveLocalPlayer: (move: PlayerMove) => void;
  updateLocalAvatar: (avatarConfig: AvatarConfig) => void;
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
  moveLocalPlayer: (move) =>
    set((state) => ({
      localPlayer: resolvePlayerMovement({
        room: state.room,
        player: state.localPlayer,
        objects: state.objects,
        itemDefinitions: roomItemDefinitions,
        move,
      }),
    })),
  updateLocalAvatar: (avatarConfig) =>
    set((state) => ({
      localPlayer: {
        ...state.localPlayer,
        avatarConfig,
      },
    })),
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
      const playerOccupiesTile =
        state.localPlayer.position.x === position.x &&
        state.localPlayer.position.y === position.y;

      if (occupied || playerOccupiesTile) {
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

      const definition = getRoomItemDefinition(state.selectedItemDefinitionId);

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
