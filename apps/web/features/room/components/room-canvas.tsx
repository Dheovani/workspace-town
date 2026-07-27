"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { roomItemDefinitions } from "@/features/room-editor/catalog/item-definitions";
import { RoomNavigationController } from "../navigation/room-navigation-controller";
import { RoomRenderer } from "../renderer/room-renderer";
import { useRoomStore } from "../stores/room-store";
import type { PlayerDirection } from "../types";

const keyMoves: Record<
  string,
  { dx: number; dy: number; direction: PlayerDirection }
> = {
  ArrowUp: { dx: 0, dy: -1, direction: "up" },
  KeyW: { dx: 0, dy: -1, direction: "up" },
  ArrowDown: { dx: 0, dy: 1, direction: "down" },
  KeyS: { dx: 0, dy: 1, direction: "down" },
  ArrowLeft: { dx: -1, dy: 0, direction: "left" },
  KeyA: { dx: -1, dy: 0, direction: "left" },
  ArrowRight: { dx: 1, dy: 0, direction: "right" },
  KeyD: { dx: 1, dy: 0, direction: "right" },
};

export function RoomCanvas() {
  const t = useTranslations("room.canvas");
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<RoomRenderer | null>(null);
  const navigationControllerRef = useRef<RoomNavigationController | null>(null);
  const localPlayer = useRoomStore((state) => state.localPlayer);
  const objects = useRoomStore((state) => state.objects);
  const isEditing = useRoomStore((state) => state.isEditing);
  const selectedObjectId = useRoomStore((state) => state.selectedObjectId);
  const moveLocalPlayer = useRoomStore((state) => state.moveLocalPlayer);

  useEffect(() => {
    let cancelled = false;
    const navigationController = new RoomNavigationController({
      getState: useRoomStore.getState,
      itemDefinitions: roomItemDefinitions,
      onDestinationChange: (destination) =>
        rendererRef.current?.setNavigationDestination(destination),
    });
    navigationControllerRef.current = navigationController;

    async function mountRenderer(): Promise<void> {
      if (!containerRef.current) {
        return;
      }

      const initialState = useRoomStore.getState();
      const renderer = await RoomRenderer.create({
        container: containerRef.current,
        room: initialState.room,
        player: initialState.localPlayer,
        objects: initialState.objects,
        editorInteraction: {
          enabled: initialState.isEditing,
          selectedObjectId: initialState.selectedObjectId,
          onTileSelect: (position) =>
            useRoomStore.getState().placeSelectionAt(position),
          onObjectSelect: (objectId) =>
            useRoomStore.getState().selectObject(objectId),
        },
        navigationInteraction: {
          onDestinationSelect: (destination) =>
            navigationController.moveTo(destination),
        },
      });

      if (cancelled) {
        renderer.destroy();
        return;
      }

      rendererRef.current = renderer;
    }

    void mountRenderer();

    return () => {
      cancelled = true;
      navigationController.cancel();
      navigationControllerRef.current = null;
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.updatePlayer(localPlayer);
  }, [localPlayer]);

  useEffect(() => {
    rendererRef.current?.updateObjects(objects);
  }, [objects]);

  useEffect(() => {
    rendererRef.current?.updateEditorInteraction({
      enabled: isEditing,
      selectedObjectId,
      onTileSelect: (position) =>
        useRoomStore.getState().placeSelectionAt(position),
      onObjectSelect: (objectId) =>
        useRoomStore.getState().selectObject(objectId),
    });
  }, [isEditing, selectedObjectId]);

  useEffect(() => {
    if (isEditing) {
      navigationControllerRef.current?.cancel();
    }
  }, [isEditing]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (isEditing) {
        return;
      }

      const move = keyMoves[event.code];

      if (!move) {
        return;
      }

      event.preventDefault();
      navigationControllerRef.current?.cancel();
      moveLocalPlayer(move);
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isEditing, moveLocalPlayer]);

  return (
    <div
      ref={containerRef}
      aria-label={t("ariaLabel")}
      className={cn(
        "h-full min-h-0 w-full overflow-hidden bg-slate-50",
        isEditing && "outline-2 outline-offset-[-2px] outline-teal-700/50",
      )}
    />
  );
}
