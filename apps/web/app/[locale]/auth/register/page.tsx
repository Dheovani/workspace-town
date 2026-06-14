import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Link } from "@/i18n/navigation";
import { getCurrentSession } from "@/lib/auth/session";

export default async function RegisterPage() {
  const t = await getTranslations("auth.register");
  const common = await getTranslations("common");
  const session = await getCurrentSession();

  if (session) {
    redirect("/workspaces");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#dcfce7,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff)] px-6 py-12 text-foreground">
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_460px]">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
            {common("appName")}
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            {t("title")}
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            {t("description")}
          </p>
        </div>

        <Card className="w-full rounded-md border-slate-200/80 bg-white/90 shadow-lg shadow-slate-200/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="justify-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("loginPrompt")}</span>
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/auth/login">{t("loginLink")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
