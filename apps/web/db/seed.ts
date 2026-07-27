import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { roomItemDefinitions } from "@/features/room-editor/catalog/item-definitions";
import {
  itemDefinitions,
  roomObjects,
  rooms,
  workspaces,
} from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://workspace_town:workspace_town@localhost:5432/workspace_town";

const queryClient = postgres(databaseUrl, {
  max: 1,
  prepare: false,
});
const database = drizzle(queryClient);

const workspaceSeeds = [
  {
    name: "Product Town",
    slug: "product-town",
    description: "Workspace inicial para times de produto.",
    roomName: "Product Main Room",
    roomSlug: "product-main-room",
  },
  {
    name: "Engineering Hub",
    slug: "engineering-hub",
    description: "Workspace inicial para times de engenharia.",
    roomName: "Engineering Main Room",
    roomSlug: "engineering-main-room",
  },
  {
    name: "Retro Square",
    slug: "retro-square",
    description: "Workspace inicial para retrospectivas.",
    roomName: "Retro Main Room",
    roomSlug: "retro-main-room",
  },
] as const;

async function seed(): Promise<void> {
  const definitionIds = new Map<string, string>();

  for (const definition of roomItemDefinitions) {
    const [savedDefinition] = await database
      .insert(itemDefinitions)
      .values({
        key: definition.id,
        name: definition.kind,
        category: definition.kind === "plant" ? "decor" : "furniture",
        defaultState: {
          color: definition.color,
          blocksMovement: definition.blocksMovement,
        },
      })
      .onConflictDoUpdate({
        target: itemDefinitions.key,
        set: {
          name: definition.kind,
          category: definition.kind === "plant" ? "decor" : "furniture",
          defaultState: {
            color: definition.color,
            blocksMovement: definition.blocksMovement,
          },
          updatedAt: new Date(),
        },
      })
      .returning({ id: itemDefinitions.id, key: itemDefinitions.key });

    if (savedDefinition) {
      definitionIds.set(savedDefinition.key, savedDefinition.id);
    }
  }

  for (const workspaceSeed of workspaceSeeds) {
    const [workspace] = await database
      .insert(workspaces)
      .values({
        name: workspaceSeed.name,
        slug: workspaceSeed.slug,
        description: workspaceSeed.description,
      })
      .onConflictDoUpdate({
        target: workspaces.slug,
        set: {
          name: workspaceSeed.name,
          description: workspaceSeed.description,
          updatedAt: new Date(),
        },
      })
      .returning({ id: workspaces.id });

    if (!workspace) {
      continue;
    }

    const [room] = await database
      .insert(rooms)
      .values({
        workspaceId: workspace.id,
        name: workspaceSeed.roomName,
        slug: workspaceSeed.roomSlug,
        width: 16,
        height: 10,
        tileSize: 48,
        isPublic: false,
      })
      .onConflictDoUpdate({
        target: [rooms.workspaceId, rooms.slug],
        set: {
          name: workspaceSeed.roomName,
          width: 16,
          height: 10,
          tileSize: 48,
          updatedAt: new Date(),
        },
      })
      .returning({ id: rooms.id });

    if (!room) {
      continue;
    }

    const [existingObject] = await database
      .select({ id: roomObjects.id })
      .from(roomObjects)
      .where(eq(roomObjects.roomId, room.id))
      .limit(1);

    const tableDefinitionId = definitionIds.get("table");
    const whiteboardDefinitionId = definitionIds.get("whiteboard");

    if (
      !existingObject &&
      tableDefinitionId &&
      whiteboardDefinitionId
    ) {
      await database.insert(roomObjects).values([
        {
          roomId: room.id,
          itemDefinitionId: tableDefinitionId,
          label: "Planning table",
          positionX: 8,
          positionY: 4,
          rotation: 0,
          state: { color: "#f59e0b", blocksMovement: true },
        },
        {
          roomId: room.id,
          itemDefinitionId: whiteboardDefinitionId,
          label: "Retro board",
          positionX: 12,
          positionY: 2,
          rotation: 0,
          state: { color: "#f8fafc", blocksMovement: true },
        },
      ]);
    }
  }
}

try {
  await seed();
  console.log("Database seed completed.");
} catch (error) {
  console.error("Database seed failed.", error);
  process.exitCode = 1;
} finally {
  await queryClient.end();
}
