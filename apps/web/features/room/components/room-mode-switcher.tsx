"use client";

import { Bug, PencilRuler, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRoomStore } from "../stores/room-store";
import type { RoomMode } from "../types";

const roomModes = [
  { id: "user", icon: UserRound },
  { id: "editor", icon: PencilRuler },
  { id: "debug", icon: Bug },
] as const;

export function RoomModeSwitcher() {
  const t = useTranslations("room.modes");
  const roomMode = useRoomStore((state) => state.roomMode);
  const setRoomMode = useRoomStore((state) => state.setRoomMode);

  return (
    <section className="border-b bg-slate-50/80 p-3">
      <h2 className="sr-only">{t("title")}</h2>
      <div className="grid grid-cols-3 gap-1 rounded-md border bg-background p-1 shadow-sm">
        {roomModes.map(({ id, icon: Icon }) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant="ghost"
            className={cn(
              "h-auto min-w-0 flex-col gap-1 px-1.5 py-2 text-[11px] text-muted-foreground",
              roomMode === id &&
                id === "user" &&
                "bg-teal-50 text-teal-900 shadow-sm hover:bg-teal-50",
              roomMode === id &&
                id === "editor" &&
                "bg-amber-50 text-amber-900 shadow-sm hover:bg-amber-50",
              roomMode === id &&
                id === "debug" &&
                "bg-slate-900 text-white shadow-sm hover:bg-slate-900 hover:text-white",
            )}
            aria-pressed={roomMode === id}
            onClick={() => setRoomMode(id as RoomMode)}
          >
            <Icon aria-hidden="true" className="size-4" />
            <span className="truncate">{t(`options.${id}`)}</span>
          </Button>
        ))}
      </div>
      <p className="mt-2 px-1 text-xs leading-relaxed text-muted-foreground">
        {t(`descriptions.${roomMode}`)}
      </p>
    </section>
  );
}
