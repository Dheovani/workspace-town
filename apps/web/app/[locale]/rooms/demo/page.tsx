import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarCustomizerPanel } from "@/features/player/components/avatar-customizer-panel";
import { RoomCanvas } from "@/features/room/components/room-canvas";
import { RoomModeSwitcher } from "@/features/room/components/room-mode-switcher";
import { RoomShell } from "@/features/room/components/room-shell";
import { RoomStatusPanel } from "@/features/room/components/room-status-panel";
import { RoomEditorPanel } from "@/features/room-editor/components/room-editor-panel";
import { Link } from "@/i18n/navigation";

export default async function DemoRoomPage() {
  const t = await getTranslations("room.demo");
  const common = await getTranslations("common");
  const actions = await getTranslations("common.actions");
  const shell = await getTranslations("room.shell");

  return (
    <RoomShell
      appName={common("appName")}
      title={t("title")}
      sidebarLabel={shell("sidebarLabel")}
      openSidebarLabel={shell("openSidebar")}
      closeSidebarLabel={shell("closeSidebar")}
      sidebar={
        <>
          <nav className="border-b p-3" aria-label={shell("navigation")}>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="w-full justify-start"
            >
              <Link href="/">
                <ArrowLeft aria-hidden="true" />
                {actions("backToLogin")}
              </Link>
            </Button>
          </nav>
          <RoomModeSwitcher />
          <AvatarCustomizerPanel />
          <RoomEditorPanel />
          <RoomStatusPanel />
        </>
      }
    >
      <RoomCanvas />
    </RoomShell>
  );
}
