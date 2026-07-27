import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import {
  itemDefinitions,
  roomObjects,
  rooms,
  workspaces,
} from "@/db/schema";
import type { RoomLayoutObjectInput, RoomObject } from "../types";

export class InvalidRoomLayoutError extends Error {}

async function findRoom(workspaceSlug: string, roomSlug: string) {
  const [room] = await db
    .select({
      id: rooms.id,
      width: rooms.width,
      height: rooms.height,
    })
    .from(rooms)
    .innerJoin(workspaces, eq(rooms.workspaceId, workspaces.id))
    .where(
      and(eq(workspaces.slug, workspaceSlug), eq(rooms.slug, roomSlug)),
    )
    .limit(1);

  return room;
}

export async function getRoomLayout(
  workspaceSlug: string,
  roomSlug: string,
): Promise<RoomObject[] | null> {
  const room = await findRoom(workspaceSlug, roomSlug);

  if (!room) {
    return null;
  }

  const objects = await db
    .select({
      id: roomObjects.id,
      itemDefinitionId: itemDefinitions.key,
      label: roomObjects.label,
      positionX: roomObjects.positionX,
      positionY: roomObjects.positionY,
      rotation: roomObjects.rotation,
      state: roomObjects.state,
    })
    .from(roomObjects)
    .innerJoin(
      itemDefinitions,
      eq(roomObjects.itemDefinitionId, itemDefinitions.id),
    )
    .where(eq(roomObjects.roomId, room.id))
    .orderBy(roomObjects.createdAt);

  return objects.map((object) => ({
    id: object.id,
    roomId: room.id,
    itemDefinitionId: object.itemDefinitionId,
    label: object.label ?? undefined,
    position: {
      x: object.positionX,
      y: object.positionY,
    },
    rotation: object.rotation,
    state: object.state,
  }));
}

export async function replaceRoomLayout(
  workspaceSlug: string,
  roomSlug: string,
  objects: RoomLayoutObjectInput[],
): Promise<RoomObject[] | null> {
  const room = await findRoom(workspaceSlug, roomSlug);

  if (!room) {
    return null;
  }

  const occupiedTiles = new Set<string>();

  for (const object of objects) {
    if (
      object.position.x >= room.width ||
      object.position.y >= room.height
    ) {
      throw new InvalidRoomLayoutError("Object position is outside the room.");
    }

    const tile = `${object.position.x}:${object.position.y}`;

    if (occupiedTiles.has(tile)) {
      throw new InvalidRoomLayoutError(
        "Multiple objects cannot occupy the same tile.",
      );
    }

    occupiedTiles.add(tile);
  }

  const definitionKeys = [
    ...new Set(objects.map((object) => object.itemDefinitionId)),
  ];
  const definitions =
    definitionKeys.length > 0
      ? await db
          .select({ id: itemDefinitions.id, key: itemDefinitions.key })
          .from(itemDefinitions)
          .where(inArray(itemDefinitions.key, definitionKeys))
      : [];

  if (definitions.length !== definitionKeys.length) {
    throw new InvalidRoomLayoutError(
      "The layout contains an unknown item definition.",
    );
  }

  const definitionIds = new Map(
    definitions.map((definition) => [definition.key, definition.id]),
  );

  await db.transaction(async (transaction) => {
    await transaction
      .delete(roomObjects)
      .where(eq(roomObjects.roomId, room.id));

    if (objects.length === 0) {
      return;
    }

    await transaction.insert(roomObjects).values(
      objects.map((object) => ({
        roomId: room.id,
        itemDefinitionId: definitionIds.get(object.itemDefinitionId)!,
        label: object.label,
        positionX: object.position.x,
        positionY: object.position.y,
        rotation: object.rotation,
        state: object.state,
      })),
    );
  });

  return getRoomLayout(workspaceSlug, roomSlug);
}
