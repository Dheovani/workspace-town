"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRoomStore } from "@/features/room/stores/room-store";
import {
  roomLayoutInputSchema,
  roomLayoutResponseSchema,
} from "@/features/room/types";

export type RoomLayoutPersistenceStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "saving"
  | "saved"
  | "loadError"
  | "saveError";

type RoomLayoutPersistenceOptions = {
  workspaceSlug?: string;
  roomSlug?: string;
};

export function useRoomLayoutPersistence({
  workspaceSlug,
  roomSlug,
}: RoomLayoutPersistenceOptions) {
  const objects = useRoomStore((state) => state.objects);
  const replaceObjects = useRoomStore((state) => state.replaceObjects);
  const [status, setStatus] =
    useState<RoomLayoutPersistenceStatus>("idle");
  const endpoint = useMemo(
    () =>
      workspaceSlug && roomSlug
        ? `/api/workspaces/${encodeURIComponent(workspaceSlug)}/rooms/${encodeURIComponent(roomSlug)}/objects`
        : null,
    [roomSlug, workspaceSlug],
  );

  const loadLayout = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!endpoint) {
        return;
      }

      setStatus("loading");

      try {
        const response = await fetch(endpoint, {
          cache: "no-store",
          signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load room layout.");
        }

        const parsed = roomLayoutResponseSchema.safeParse(
          await response.json(),
        );

        if (!parsed.success) {
          throw new Error("Invalid room layout response.");
        }

        replaceObjects(parsed.data.objects);
        setStatus("loaded");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setStatus("loadError");
      }
    },
    [endpoint, replaceObjects],
  );

  const saveLayout = useCallback(async (): Promise<void> => {
    if (!endpoint) {
      return;
    }

    setStatus("saving");

    const payload = roomLayoutInputSchema.parse({
      objects: objects.map((object) => ({
        id: object.id,
        itemDefinitionId: object.itemDefinitionId,
        label: object.label,
        position: object.position,
        rotation: object.rotation,
        state: object.state,
      })),
    });

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to save room layout.");
      }

      const parsed = roomLayoutResponseSchema.safeParse(
        await response.json(),
      );

      if (!parsed.success) {
        throw new Error("Invalid room layout response.");
      }

      replaceObjects(parsed.data.objects);
      setStatus("saved");
    } catch {
      setStatus("saveError");
    }
  }, [endpoint, objects, replaceObjects]);

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    const controller = new AbortController();
    void loadLayout(controller.signal);

    return () => {
      controller.abort();
    };
  }, [endpoint, loadLayout]);

  return {
    canPersist: Boolean(endpoint),
    loadLayout,
    saveLayout,
    status,
  };
}
