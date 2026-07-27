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

type ResolvePlayerMovementOptions = {
  room: Room;
  player: Player;
  objects: RoomObject[];
  itemDefinitions: ItemDefinition[];
  move: PlayerMove;
};

function objectBlocksMovement(
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
      objectBlocksMovement(object, itemDefinitions),
  );

  return {
    ...player,
    direction: move.direction,
    position: isOutsideRoom || isBlocked ? player.position : target,
  };
}
