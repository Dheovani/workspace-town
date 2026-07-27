import type { ItemDefinition } from "@/features/room/types";

export const roomItemDefinitions = [
  {
    id: "table",
    kind: "table",
    translationKey: "table",
    color: "#f59e0b",
    blocksMovement: true,
  },
  {
    id: "chair",
    kind: "chair",
    translationKey: "chair",
    color: "#0ea5e9",
    blocksMovement: true,
  },
  {
    id: "whiteboard",
    kind: "whiteboard",
    translationKey: "whiteboard",
    color: "#f8fafc",
    blocksMovement: true,
  },
  {
    id: "plant",
    kind: "plant",
    translationKey: "plant",
    color: "#22c55e",
    blocksMovement: true,
  },
] satisfies ItemDefinition[];

export function getRoomItemDefinition(
  itemDefinitionId: string,
): ItemDefinition | undefined {
  return roomItemDefinitions.find(
    (definition) => definition.id === itemDefinitionId,
  );
}
