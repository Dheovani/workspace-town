import type {
  ItemDefinition,
  Player,
  PlayerDirection,
  Room,
  RoomObject,
} from "../types";

export type PlayerMove = {
  dx: number;
  dy: number;
  direction: PlayerDirection;
};

export function createPlayerMove(
  current: { x: number; y: number },
  next: { x: number; y: number },
): PlayerMove | null {
  const dx = next.x - current.x;
  const dy = next.y - current.y;

  if (Math.abs(dx) + Math.abs(dy) !== 1) {
    return null;
  }

  if (dx > 0) {
    return { dx, dy, direction: "right" };
  }

  if (dx < 0) {
    return { dx, dy, direction: "left" };
  }

  return { dx, dy, direction: dy > 0 ? "down" : "up" };
}

type ResolvePlayerMovementOptions = {
  room: Room;
  player: Player;
  objects: RoomObject[];
  itemDefinitions: ItemDefinition[];
  move: PlayerMove;
};

export function roomObjectBlocksMovement(
  object: RoomObject,
  itemDefinitions: ItemDefinition[],
): boolean {
  if (typeof object.state.blocksMovement === "boolean") {
    return object.state.blocksMovement;
  }

  return (
    itemDefinitions.find(
      (definition) => definition.id === object.itemDefinitionId,
    )?.blocksMovement ?? true
  );
}

export function resolvePlayerMovement({
  room,
  player,
  objects,
  itemDefinitions,
  move,
}: ResolvePlayerMovementOptions): Player {
  const target = {
    x: player.position.x + move.dx,
    y: player.position.y + move.dy,
  };
  const isOutsideRoom =
    target.x < 0 ||
    target.x >= room.width ||
    target.y < 0 ||
    target.y >= room.height;
  const isBlocked = objects.some(
    (object) =>
      object.position.x === target.x &&
      object.position.y === target.y &&
      roomObjectBlocksMovement(object, itemDefinitions),
  );

  return {
    ...player,
    direction: move.direction,
    position: isOutsideRoom || isBlocked ? player.position : target,
  };
}
