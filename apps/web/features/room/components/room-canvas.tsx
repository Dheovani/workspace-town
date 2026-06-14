"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
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
  const localPlayer = useRoomStore((state) => state.localPlayer);
  const objects = useRoomStore((state) => state.objects);
  const moveLocalPlayer = useRoomStore((state) => state.moveLocalPlayer);

  useEffect(() => {
    let cancelled = false;

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
    function onKeyDown(event: KeyboardEvent): void {
      const move = keyMoves[event.code];

      if (!move) {
        return;
      }

      event.preventDefault();
      moveLocalPlayer(move);
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [moveLocalPlayer]);

  return (
    <div
      ref={containerRef}
      aria-label={t("ariaLabel")}
      className="h-[min(70vh,640px)] min-h-[420px] w-full overflow-hidden rounded-md border bg-slate-50 shadow-sm"
    />
  );
}
