import { getTranslations } from "next-intl/server";
import { RoomCanvas } from "@/features/room/components/room-canvas";
import { RoomStatusPanel } from "@/features/room/components/room-status-panel";
import { RoomEditorPanel } from "@/features/room-editor/components/room-editor-panel";
import { Link } from "@/i18n/navigation";

export default async function DemoRoomPage() {
  const t = await getTranslations("room.demo");

  return (
    <main className="min-h-screen bg-background px-6 py-6 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-col justify-between gap-3 border-b pb-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t("backLabel")}
            </Link>
            <h1 className="mt-2 text-3xl font-semibold">{t("title")}</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {t("description")}
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <RoomCanvas />
          <div className="flex flex-col gap-4">
            <RoomEditorPanel />
            <RoomStatusPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
