import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { RoomCanvas } from "@/features/room/components/room-canvas";
import { RoomStatusPanel } from "@/features/room/components/room-status-panel";
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
  const actions = await getTranslations("common.actions");
  const labels = await getTranslations("common.labels");
  const workspaces = await getTranslations("workspaces");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc,#eef2ff)] px-6 py-6 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {map("eyebrow")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              {workspaces(`items.${workspace.translationKey}.name`)}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {workspaces(`items.${workspace.translationKey}.description`)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/workspaces">{actions("backToWorkspaces")}</Link>
            </Button>
            <SignOutButton />
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <RoomCanvas />
          <div className="flex flex-col gap-4">
            <aside className="rounded-md border border-slate-200 bg-white p-4 text-sm shadow-sm">
              <h2 className="text-base font-semibold">
                {labels("workspace")}
              </h2>
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
                  <dd className="font-medium text-foreground">
                    {workspace.defaultRoomId}
                  </dd>
                </div>
              </dl>
            </aside>
            <RoomStatusPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
