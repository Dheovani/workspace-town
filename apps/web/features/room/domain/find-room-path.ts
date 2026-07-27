import Pathfinding from "pathfinding";
import type {
  ItemDefinition,
  PlayerPosition,
  Room,
  RoomObject,
} from "../types";
import { roomObjectBlocksMovement } from "./player-movement";

type FindRoomPathOptions = {
  room: Room;
  objects: RoomObject[];
  itemDefinitions: ItemDefinition[];
  start: PlayerPosition;
  destination: PlayerPosition;
};

export function findRoomPath({
  room,
  objects,
  itemDefinitions,
  start,
  destination,
}: FindRoomPathOptions): PlayerPosition[] {
  const grid = new Pathfinding.Grid(room.width, room.height);

  for (const object of objects) {
    if (roomObjectBlocksMovement(object, itemDefinitions)) {
      grid.setWalkableAt(object.position.x, object.position.y, false);
    }
  }

  grid.setWalkableAt(start.x, start.y, true);

  if (!grid.isWalkableAt(destination.x, destination.y)) {
    return [];
  }

  const finder = new Pathfinding.AStarFinder({
    diagonalMovement: Pathfinding.DiagonalMovement.Never,
  });
  const path = finder.findPath(
    start.x,
    start.y,
    destination.x,
    destination.y,
    grid,
  );

  return path
    .slice(1)
    .flatMap(([x, y]) =>
      typeof x === "number" && typeof y === "number" ? [{ x, y }] : [],
    );
}
