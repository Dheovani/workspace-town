"use client";

import {
  Armchair,
  Loader2,
  Presentation,
  RefreshCw,
  RotateCw,
  Save,
  Sprout,
  Table2,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRoomStore } from "@/features/room/stores/room-store";
import type { ItemDefinitionKind } from "@/features/room/types";
import {
  getRoomItemDefinition,
  roomItemDefinitions,
} from "../catalog/item-definitions";
import { useRoomLayoutPersistence } from "../hooks/use-room-layout-persistence";

function ItemIcon({ kind }: { kind: ItemDefinitionKind }) {
  switch (kind) {
    case "chair":
      return <Armchair aria-hidden="true" />;
    case "whiteboard":
      return <Presentation aria-hidden="true" />;
    case "plant":
      return <Sprout aria-hidden="true" />;
    default:
      return <Table2 aria-hidden="true" />;
  }
}

type RoomEditorPanelProps = {
  workspaceSlug?: string;
  roomSlug?: string;
};

export function RoomEditorPanel({
  workspaceSlug,
  roomSlug,
}: RoomEditorPanelProps) {
  const t = useTranslations("room.editor");
  const roomMode = useRoomStore((state) => state.roomMode);
  const objects = useRoomStore((state) => state.objects);
  const selectedItemDefinitionId = useRoomStore(
    (state) => state.selectedItemDefinitionId,
  );
  const selectedObjectId = useRoomStore((state) => state.selectedObjectId);
  const selectItemDefinition = useRoomStore(
    (state) => state.selectItemDefinition,
  );
  const rotateSelectedObject = useRoomStore(
    (state) => state.rotateSelectedObject,
  );
  const removeSelectedObject = useRoomStore(
    (state) => state.removeSelectedObject,
  );
  const { canPersist, loadLayout, saveLayout, status } =
    useRoomLayoutPersistence({
      workspaceSlug,
      roomSlug,
    });
  const selectedObject = objects.find(
    (object) => object.id === selectedObjectId,
  );
  const selectedDefinition = getRoomItemDefinition(
    selectedObject?.itemDefinitionId ?? selectedItemDefinitionId ?? "",
  );

  if (roomMode !== "editor") {
    return null;
  }

  return (
    <section className="border-b border-amber-200 bg-amber-50/40 p-4 text-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{t("title")}</h2>
        <span className="rounded-sm bg-amber-200 px-2 py-1 text-[10px] font-semibold uppercase text-amber-950">
          {t("active")}
        </span>
      </div>

      <div className="mt-4 border-t border-amber-200 pt-4">
        <h3 className="text-xs font-medium text-muted-foreground">
          {t("catalog")}
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {roomItemDefinitions.map((definition) => (
            <Button
              key={definition.id}
              type="button"
              size="sm"
              variant={
                selectedItemDefinitionId === definition.id
                  ? "default"
                  : "outline"
              }
              className="justify-start"
              onClick={() => selectItemDefinition(definition.id)}
            >
              <ItemIcon kind={definition.kind} />
              {t(`items.${definition.translationKey}`)}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-amber-200 pt-4">
        <h3 className="text-xs font-medium text-muted-foreground">
          {t("selection")}
        </h3>
        <div className="mt-2 flex min-h-8 items-center justify-between gap-3">
          <p className="font-medium">
            {selectedDefinition
              ? t(`items.${selectedDefinition.translationKey}`)
              : t("noSelection")}
          </p>
          {selectedObject ? (
            <span className="text-xs text-muted-foreground">
              {selectedObject.position.x}, {selectedObject.position.y}
            </span>
          ) : null}
        </div>

        {selectedObject ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={rotateSelectedObject}
            >
              <RotateCw aria-hidden="true" />
              {t("actions.rotate")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={removeSelectedObject}
            >
              <Trash2 aria-hidden="true" />
              {t("actions.remove")}
            </Button>
          </div>
        ) : null}
      </div>

      <p className="mt-4 border-t border-amber-200 pt-3 text-xs text-muted-foreground">
        {t("objectCount", { count: objects.length })}
      </p>

      {canPersist ? (
        <div className="mt-3 flex items-center gap-2 border-t border-amber-200 pt-3">
          <Button
            type="button"
            size="sm"
            className="flex-1"
            disabled={status === "loading" || status === "saving"}
            onClick={() => void saveLayout()}
          >
            {status === "saving" ? (
              <Loader2 aria-hidden="true" className="animate-spin" />
            ) : (
              <Save aria-hidden="true" />
            )}
            {status === "saving"
              ? t("persistence.saving")
              : t("persistence.save")}
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            disabled={status === "loading" || status === "saving"}
            aria-label={t("persistence.reload")}
            title={t("persistence.reload")}
            onClick={() => void loadLayout()}
          >
            <RefreshCw
              aria-hidden="true"
              className={status === "loading" ? "animate-spin" : undefined}
            />
          </Button>
        </div>
      ) : null}

      {canPersist &&
      ["loaded", "saved", "loadError", "saveError"].includes(status) ? (
        <p
          className={
            status === "loadError" || status === "saveError"
              ? "mt-2 text-xs text-destructive"
              : "mt-2 text-xs text-muted-foreground"
          }
          role={
            status === "loadError" || status === "saveError"
              ? "alert"
              : "status"
          }
        >
          {t(`persistence.status.${status}`)}
        </p>
      ) : null}
    </section>
  );
}
