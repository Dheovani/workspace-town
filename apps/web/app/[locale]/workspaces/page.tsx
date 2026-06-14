import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockWorkspaces } from "@/features/workspaces/mocks/workspaces";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { Link } from "@/i18n/navigation";
import { requireCurrentSession } from "@/lib/auth/session";

export default async function WorkspacesPage() {
  const session = await requireCurrentSession();
  const t = await getTranslations("workspaces");
  const labels = await getTranslations("common.labels");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc,#eef2ff)] px-6 py-10 text-foreground">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold text-slate-950">
                {t("title")}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {t("description")}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {t("signedInHelper")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md border bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm">
                {session.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockWorkspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="rounded-md border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader>
                <CardTitle>
                  {t(`items.${workspace.translationKey}.name`)}
                </CardTitle>
                <CardDescription>
                  {t(`items.${workspace.translationKey}.description`)}
                </CardDescription>
                <CardAction>
                  <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                    {labels("mock")}
                  </span>
                </CardAction>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">
                      {labels("members")}
                    </dt>
                    <dd className="mt-1 font-medium">{workspace.memberCount}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      {labels("rooms")}
                    </dt>
                    <dd className="mt-1 font-medium">{workspace.roomCount}</dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/workspaces/${workspace.slug}/map`}>
                    {labels("enterWorkspace")}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
