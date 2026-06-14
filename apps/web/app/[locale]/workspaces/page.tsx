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
import { Link } from "@/i18n/navigation";

export default async function WorkspacesPage() {
  const t = await getTranslations("workspaces");
  const actions = await getTranslations("common.actions");
  const labels = await getTranslations("common.labels");

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3 border-b pb-6">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold">{t("title")}</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {t("description")}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/auth/login">{actions("backToLogin")}</Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockWorkspaces.map((workspace) => (
            <Card key={workspace.id} className="rounded-md">
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
                    {actions("enter")}
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
