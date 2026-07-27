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
import type {
  AvatarConfig,
  Player,
  Room,
  RoomMode,
  RoomObject,
} from "../types";

const demoRoom: Room = {
  id: "demo",
  name: "Demo Room",
  width: 24,
  height: 16,
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
    displayName: "local-player",
  },
  position: { x: 5, y: 8 },
  direction: "down",
};

const demoObjects: RoomObject[] = [
  {
    id: "focus-desk-left",
    roomId: demoRoom.id,
    itemDefinitionId: "table",
    label: "Focus desk",
    position: { x: 8, y: 6 },
    rotation: 0,
    state: { color: "#d89b57" },
  },
  {
    id: "focus-chair-left",
    roomId: demoRoom.id,
    itemDefinitionId: "chair",
    label: "Desk chair",
    position: { x: 8, y: 7 },
    rotation: 0,
    state: { color: "#397c72" },
  },
  {
    id: "focus-desk-right",
    roomId: demoRoom.id,
    itemDefinitionId: "table",
    label: "Focus desk",
    position: { x: 10, y: 6 },
    rotation: 0,
    state: { color: "#d89b57" },
  },
  {
    id: "focus-chair-right",
    roomId: demoRoom.id,
    itemDefinitionId: "chair",
    label: "Desk chair",
    position: { x: 10, y: 7 },
    rotation: 0,
    state: { color: "#397c72" },
  },
  {
    id: "focus-board",
    roomId: demoRoom.id,
    itemDefinitionId: "whiteboard",
    label: "Planning board",
    position: { x: 11, y: 4 },
    rotation: 0,
    state: { color: "#3a8ca0" },
  },
  {
    id: "spawn-plant",
    roomId: demoRoom.id,
    itemDefinitionId: "plant",
    label: "Office plant",
    position: { x: 2, y: 6 },
    rotation: 0,
    state: { color: "#3f8f67" },
  },
  {
    id: "daily-table",
    roomId: demoRoom.id,
    itemDefinitionId: "table",
    label: "Daily table",
    position: { x: 16, y: 7 },
    rotation: 0,
    state: { color: "#d68167" },
  },
  {
    id: "daily-chair-north",
    roomId: demoRoom.id,
    itemDefinitionId: "chair",
    label: "Daily chair",
    position: { x: 16, y: 6 },
    rotation: 180,
    state: { color: "#d5a63f" },
  },
  {
    id: "daily-chair-south",
    roomId: demoRoom.id,
    itemDefinitionId: "chair",
    label: "Daily chair",
    position: { x: 16, y: 8 },
    rotation: 0,
    state: { color: "#d5a63f" },
  },
  {
    id: "daily-chair-west",
    roomId: demoRoom.id,
    itemDefinitionId: "chair",
    label: "Daily chair",
    position: { x: 15, y: 7 },
    rotation: 90,
    state: { color: "#d5a63f" },
  },
  {
    id: "daily-chair-east",
    roomId: demoRoom.id,
    itemDefinitionId: "chair",
    label: "Daily chair",
    position: { x: 17, y: 7 },
    rotation: 270,
    state: { color: "#d5a63f" },
  },
  {
    id: "daily-plant",
    roomId: demoRoom.id,
    itemDefinitionId: "plant",
    label: "Office plant",
    position: { x: 20, y: 5 },
    rotation: 0,
    state: { color: "#5a9f69" },
  },
];

type RoomState = {
  room: Room;
  localPlayer: Player;
  objects: RoomObject[];
  roomMode: RoomMode;
  isEditing: boolean;
  selectedItemDefinitionId: string | null;
  selectedObjectId: string | null;
  moveLocalPlayer: (move: PlayerMove) => void;
  updateLocalAvatar: (avatarConfig: AvatarConfig) => void;
  setRoomMode: (roomMode: RoomMode) => void;
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
  roomMode: "user",
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
  setRoomMode: (roomMode) =>
    set({
      roomMode,
      isEditing: roomMode === "editor",
      selectedItemDefinitionId: null,
      selectedObjectId: null,
    }),
  setEditing: (isEditing) =>
    set({
      roomMode: isEditing ? "editor" : "user",
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
