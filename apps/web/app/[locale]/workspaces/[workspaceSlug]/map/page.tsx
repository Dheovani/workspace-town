import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { RoomCanvas } from "@/features/room/components/room-canvas";
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
          <nav className="border-b p-4" aria-label={shell("navigation")}>
            <h2 className="text-xs font-medium text-muted-foreground">
              {shell("navigation")}
            </h2>
            <div className="mt-2 grid gap-2">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/workspaces">
                  <ArrowLeft aria-hidden="true" />
                  {actions("backToWorkspaces")}
                </Link>
              </Button>
              <SignOutButton className="w-full justify-start" />
            </div>
          </nav>

          <section className="border-b p-4 text-sm">
            <h2 className="text-base font-semibold">{labels("workspace")}</h2>
            <dl className="mt-3 grid gap-2 text-muted-foreground">
              <div className="flex justify-between gap-3">
                <dt>{labels("members")}</dt>
                <dd className="font-medium text-foreground">
                  {workspace.memberCount}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{labels("rooms")}</dt>
                <dd className="font-medium text-foreground">
                  {workspace.roomCount}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{map("defaultRoom")}</dt>
                <dd className="max-w-40 truncate font-medium text-foreground">
                  {workspace.defaultRoomId}
                </dd>
              </div>
            </dl>
          </section>

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
