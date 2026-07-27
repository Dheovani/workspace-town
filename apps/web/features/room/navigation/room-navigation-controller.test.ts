import { describe, expect, test } from "bun:test";
import type { ItemDefinition, Player, Room, RoomObject } from "../types";
import {
  resolvePlayerMovement,
  type PlayerMove,
} from "../domain/player-movement";
import { RoomNavigationController } from "./room-navigation-controller";

const room: Room = {
  id: "room",
  name: "Room",
  width: 8,
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

function createPlayer(): Player {
  return {
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
    position: { x: 1, y: 1 },
    direction: "down",
  };
}

describe("RoomNavigationController", () => {
  test("advances through a path and clears the destination on arrival", () => {
    let player = createPlayer();
    let intervalCallback: (() => void) | undefined;
    const destinations: ({ x: number; y: number } | null)[] = [];
    const getState = () => ({
      room,
      localPlayer: player,
      objects: [],
      isEditing: false,
      moveLocalPlayer: (move: PlayerMove) => {
        player = resolvePlayerMovement({
          room,
          player,
          objects: [],
          itemDefinitions: definitions,
          move,
        });
      },
    });
    const controller = new RoomNavigationController({
      getState,
      itemDefinitions: definitions,
      onDestinationChange: (destination) => destinations.push(destination),
      scheduleInterval: (callback) => {
        intervalCallback = callback;
        return 1 as unknown as ReturnType<typeof setInterval>;
      },
      cancelInterval: () => undefined,
    });

    expect(controller.moveTo({ x: 3, y: 1 })).toBe(true);
    expect(player.position).toEqual({ x: 2, y: 1 });

    const runInterval = () => {
      const callback = intervalCallback;

      if (!callback) {
        throw new Error("Expected navigation interval to be scheduled.");
      }

      callback();
    };

    runInterval();
    expect(player.position).toEqual({ x: 3, y: 1 });
    runInterval();
    expect(destinations).toEqual([{ x: 3, y: 1 }, null]);
  });

  test("does not start navigation while the room editor is active", () => {
    const destinations: ({ x: number; y: number } | null)[] = [];
    const controller = new RoomNavigationController({
      getState: () => ({
        room,
        localPlayer: createPlayer(),
        objects: [],
        isEditing: true,
        moveLocalPlayer: () => undefined,
      }),
      itemDefinitions: definitions,
      onDestinationChange: (destination) => destinations.push(destination),
    });

    expect(controller.moveTo({ x: 3, y: 1 })).toBe(false);
    expect(destinations).toEqual([]);
  });

  test("cancels the path when a new obstacle blocks the next step", () => {
    let player = createPlayer();
    let objects: RoomObject[] = [];
    let intervalCallback: (() => void) | undefined;
    const destinations: ({ x: number; y: number } | null)[] = [];
    const getState = () => ({
      room,
      localPlayer: player,
      objects,
      isEditing: false,
      moveLocalPlayer: (move: PlayerMove) => {
        player = resolvePlayerMovement({
          room,
          player,
          objects,
          itemDefinitions: definitions,
          move,
        });
      },
    });
    const controller = new RoomNavigationController({
      getState,
      itemDefinitions: definitions,
      onDestinationChange: (destination) => destinations.push(destination),
      scheduleInterval: (callback) => {
        intervalCallback = callback;
        return 1 as unknown as ReturnType<typeof setInterval>;
      },
      cancelInterval: () => undefined,
    });

    controller.moveTo({ x: 4, y: 1 });
    objects = [
      {
        id: "new-table",
        roomId: room.id,
        itemDefinitionId: "table",
        position: { x: 3, y: 1 },
        rotation: 0,
        state: {},
      },
    ];
    const callback = intervalCallback;

    if (!callback) {
      throw new Error("Expected navigation interval to be scheduled.");
    }

    callback();

    expect(player.position).toEqual({ x: 2, y: 1 });
    expect(destinations).toEqual([{ x: 4, y: 1 }, null]);
  });
});
