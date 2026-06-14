import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

export default async function LoginPage() {
  const t = await getTranslations("auth.login");
  const actions = await getTranslations("common.actions");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <Card className="w-full max-w-md rounded-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-muted-foreground">
            {t("helper")}
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/workspaces">{actions("enter")}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
