import { describe, expect, test } from "bun:test";
import type { ItemDefinition, Player, Room, RoomObject } from "../types";
import { createPlayerMove, resolvePlayerMovement } from "./player-movement";

const room: Room = {
  id: "room",
  name: "Room",
  width: 10,
  height: 8,
  tileSize: 48,
  isPublic: false,
};

const player: Player = {
  id: "player",
  roomId: room.id,
  name: "Player",
  avatarConfig: {
    skinTone: "#d49a6a",
    hairStyle: "short",
    hairColor: "#1f2937",
    faceStyle: "neutral",
    shirtStyle: "tshirt",
    shirtColor: "#38bdf8",
    pantsColor: "#334155",
    shoeColor: "#f8fafc",
    displayName: "Player",
  },
  position: { x: 3, y: 3 },
  direction: "down",
};

const definitions: ItemDefinition[] = [
  {
    id: "table",
    kind: "table",
    translationKey: "table",
    color: "#f59e0b",
    blocksMovement: true,
  },
  {
    id: "rug",
    kind: "table",
    translationKey: "table",
    color: "#94a3b8",
    blocksMovement: false,
  },
];

function createObject(
  itemDefinitionId: string,
  state: RoomObject["state"] = {},
): RoomObject {
  return {
    id: `object-${itemDefinitionId}`,
    roomId: room.id,
    itemDefinitionId,
    position: { x: 4, y: 3 },
    rotation: 0,
    state,
  };
}

describe("resolvePlayerMovement", () => {
  test("moves the player to a free tile", () => {
    const result = resolvePlayerMovement({
      room,
      player,
      objects: [],
      itemDefinitions: definitions,
      move: { dx: 1, dy: 0, direction: "right" },
    });

    expect(result.position).toEqual({ x: 4, y: 3 });
    expect(result.direction).toBe("right");
  });

  test("keeps the player inside the room while updating direction", () => {
    const result = resolvePlayerMovement({
      room,
      player: { ...player, position: { x: 0, y: 3 } },
      objects: [],
      itemDefinitions: definitions,
      move: { dx: -1, dy: 0, direction: "left" },
    });

    expect(result.position).toEqual({ x: 0, y: 3 });
    expect(result.direction).toBe("left");
  });

  test("blocks movement onto an object marked as blocking", () => {
    const result = resolvePlayerMovement({
      room,
      player,
      objects: [createObject("table")],
      itemDefinitions: definitions,
      move: { dx: 1, dy: 0, direction: "right" },
    });

    expect(result.position).toEqual(player.position);
    expect(result.direction).toBe("right");
  });

  test("allows movement onto a passable object", () => {
    const result = resolvePlayerMovement({
      room,
      player,
      objects: [createObject("rug")],
      itemDefinitions: definitions,
      move: { dx: 1, dy: 0, direction: "right" },
    });

    expect(result.position).toEqual({ x: 4, y: 3 });
  });

  test("uses object state as an explicit movement override", () => {
    const result = resolvePlayerMovement({
      room,
      player,
      objects: [createObject("table", { blocksMovement: false })],
      itemDefinitions: definitions,
      move: { dx: 1, dy: 0, direction: "right" },
    });

    expect(result.position).toEqual({ x: 4, y: 3 });
  });

  test("treats objects with unknown definitions as blocking", () => {
    const result = resolvePlayerMovement({
      room,
      player,
      objects: [createObject("unknown")],
      itemDefinitions: definitions,
      move: { dx: 1, dy: 0, direction: "right" },
    });

    expect(result.position).toEqual(player.position);
  });
});

describe("createPlayerMove", () => {
  test("creates directional moves between adjacent tiles", () => {
    expect(createPlayerMove({ x: 2, y: 2 }, { x: 3, y: 2 })).toEqual({
      dx: 1,
      dy: 0,
      direction: "right",
    });
    expect(createPlayerMove({ x: 2, y: 2 }, { x: 2, y: 1 })).toEqual({
      dx: 0,
      dy: -1,
      direction: "up",
    });
  });

  test("rejects diagonal and non-adjacent steps", () => {
    expect(createPlayerMove({ x: 2, y: 2 }, { x: 3, y: 3 })).toBeNull();
    expect(createPlayerMove({ x: 2, y: 2 }, { x: 4, y: 2 })).toBeNull();
  });
});
