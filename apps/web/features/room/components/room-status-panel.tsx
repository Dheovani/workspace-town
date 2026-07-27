"use client";

import { useTranslations } from "next-intl";
import { useRoomStore } from "../stores/room-store";

export function RoomStatusPanel() {
  const t = useTranslations("room.status");
  const player = useRoomStore((state) => state.localPlayer);
  const roomMode = useRoomStore((state) => state.roomMode);

  if (roomMode !== "debug") {
    return null;
  }

  return (
    <section className="border-b bg-slate-950 p-4 text-sm text-white">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{t("title")}</h2>
        <span className="rounded-sm bg-emerald-400/15 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-300">
          {t("active")}
        </span>
      </div>
      <dl className="mt-3 grid gap-2 text-muted-foreground">
        <div className="flex justify-between gap-3">
          <dt>{t("player")}</dt>
          <dd className="font-medium text-white">{t("localPlayerName")}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{t("position")}</dt>
          <dd className="font-mono font-medium text-white">
            {player.position.x}, {player.position.y}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{t("direction")}</dt>
          <dd className="font-medium capitalize text-white">
            {t(`directions.${player.direction}`)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
