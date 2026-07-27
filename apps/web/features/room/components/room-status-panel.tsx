"use client";

import { useTranslations } from "next-intl";
import { useRoomStore } from "../stores/room-store";

export function RoomStatusPanel() {
  const t = useTranslations("room.status");
  const player = useRoomStore((state) => state.localPlayer);

  return (
    <section className="border-b p-4 text-sm">
      <h2 className="text-base font-semibold">{t("title")}</h2>
      <dl className="mt-3 grid gap-2 text-muted-foreground">
        <div className="flex justify-between gap-3">
          <dt>{t("player")}</dt>
          <dd className="font-medium text-foreground">
            {t("localPlayerName")}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{t("position")}</dt>
          <dd className="font-medium text-foreground">
            {player.position.x}, {player.position.y}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{t("direction")}</dt>
          <dd className="font-medium capitalize text-foreground">
            {t(`directions.${player.direction}`)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
