import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, DoorOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { AvatarCustomizerPanel } from "@/features/player/components/avatar-customizer-panel";
import { RoomCanvas } from "@/features/room/components/room-canvas";
import { RoomModeSwitcher } from "@/features/room/components/room-mode-switcher";
import { RoomShell } from "@/features/room/components/room-shell";
import { RoomStatusPanel } from "@/features/room/components/room-status-panel";
import { RoomEditorPanel } from "@/features/room-editor/components/room-editor-panel";
import { getMockWorkspaceBySlug } from "@/features/workspaces/mocks/workspaces";
import { Link } from "@/i18n/navigation";
import { requireCurrentSession } from "@/lib/auth/session";

type WorkspaceMapPageProps = {
  params: Promise<{
    workspaceSlug: string;
  }>;
};

export default async function WorkspaceMapPage({
  params,
}: WorkspaceMapPageProps) {
  await requireCurrentSession();
  const { workspaceSlug } = await params;
  const workspace = getMockWorkspaceBySlug(workspaceSlug);

  if (!workspace) {
    notFound();
  }

  const map = await getTranslations("map");
  const common = await getTranslations("common");
  const actions = await getTranslations("common.actions");
  const labels = await getTranslations("common.labels");
  const shell = await getTranslations("room.shell");
  const workspaces = await getTranslations("workspaces");

  return (
    <RoomShell
      appName={common("appName")}
      title={workspaces(`items.${workspace.translationKey}.name`)}
      sidebarLabel={shell("sidebarLabel")}
      openSidebarLabel={shell("openSidebar")}
      closeSidebarLabel={shell("closeSidebar")}
      sidebar={
        <>
          <nav className="border-b p-3" aria-label={shell("navigation")}>
            <div className="grid grid-cols-2 gap-2">
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="justify-start"
              >
                <Link href="/workspaces">
                  <ArrowLeft aria-hidden="true" />
                  {actions("backToWorkspaces")}
                </Link>
              </Button>
              <SignOutButton className="justify-start" />
            </div>
          </nav>

          <RoomModeSwitcher />
          <section className="border-b p-4 text-sm">
            <h2 className="text-xs font-semibold uppercase text-muted-foreground">
              {labels("workspace")}
            </h2>
            <dl className="mt-3 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-2 text-emerald-950">
                <Users aria-hidden="true" className="size-4" />
                <dt className="sr-only">{labels("members")}</dt>
                <dd className="font-semibold">{workspace.memberCount}</dd>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-amber-50 px-2.5 py-2 text-amber-950">
                <DoorOpen aria-hidden="true" className="size-4" />
                <dt className="sr-only">{labels("rooms")}</dt>
                <dd className="font-semibold">{workspace.roomCount}</dd>
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md bg-slate-100 px-2.5 py-2">
                <dt>{map("defaultRoom")}</dt>
                <dd className="max-w-40 truncate font-medium text-foreground">
                  {workspace.defaultRoomId}
                </dd>
              </div>
            </dl>
          </section>

          <AvatarCustomizerPanel />
          <RoomEditorPanel
            workspaceSlug={workspace.slug}
            roomSlug={workspace.defaultRoomId}
          />
          <RoomStatusPanel />
        </>
      }
    >
      <RoomCanvas />
    </RoomShell>
  );
}
