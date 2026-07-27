import { describe, expect, test } from "bun:test";
import type { ItemDefinition, Room, RoomObject } from "../types";
import { findRoomPath } from "./find-room-path";

const room: Room = {
  id: "room",
  name: "Room",
  width: 6,
  height: 5,
  tileSize: 48,
  isPublic: false,
};

const definitions: ItemDefinition[] = [
  {
    id: "table",
    kind: "table",
    translationKey: "table",
    color: "#f59e0b",
    blocksMovement: true,
  },
];

function createObject(
  id: string,
  x: number,
  y: number,
  state: RoomObject["state"] = {},
): RoomObject {
  return {
    id,
    roomId: room.id,
    itemDefinitionId: "table",
    position: { x, y },
    rotation: 0,
    state,
  };
}

describe("findRoomPath", () => {
  test("returns an orthogonal path without repeating the starting tile", () => {
    const path = findRoomPath({
      room,
      objects: [],
      itemDefinitions: definitions,
      start: { x: 1, y: 1 },
      destination: { x: 4, y: 1 },
    });

    expect(path).toEqual([
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ]);
  });

  test("routes around blocking objects", () => {
    const path = findRoomPath({
      room,
      objects: [createObject("middle", 2, 1)],
      itemDefinitions: definitions,
      start: { x: 1, y: 1 },
      destination: { x: 3, y: 1 },
    });

    expect(path).not.toContainEqual({ x: 2, y: 1 });
    expect(path.at(-1)).toEqual({ x: 3, y: 1 });
    expect(path).toHaveLength(4);
  });

  test("returns no path when the destination is blocking", () => {
    const path = findRoomPath({
      room,
      objects: [createObject("destination", 3, 1)],
      itemDefinitions: definitions,
      start: { x: 1, y: 1 },
      destination: { x: 3, y: 1 },
    });

    expect(path).toEqual([]);
  });

  test("allows paths through objects with a passable state override", () => {
    const path = findRoomPath({
      room,
      objects: [createObject("passable", 2, 1, { blocksMovement: false })],
      itemDefinitions: definitions,
      start: { x: 1, y: 1 },
      destination: { x: 3, y: 1 },
    });

    expect(path).toEqual([
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ]);
  });

  test("returns no path when blocking objects divide the room", () => {
    const wall = Array.from({ length: room.height }, (_, y) =>
      createObject(`wall-${y}`, 2, y),
    );
    const path = findRoomPath({
      room,
      objects: wall,
      itemDefinitions: definitions,
      start: { x: 1, y: 2 },
      destination: { x: 4, y: 2 },
    });

    expect(path).toEqual([]);
  });
});
