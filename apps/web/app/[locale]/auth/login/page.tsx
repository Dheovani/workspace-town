import { getTranslations } from "next-intl/server";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { Link } from "@/i18n/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const t = await getTranslations("auth.login");
  const common = await getTranslations("common");
  const session = await getCurrentSession();

  if (session) {
    redirect("/workspaces");
  }

  return (
    <AuthPageShell
      appName={common("appName")}
      title={t("submit")}
      description={t("description")}
      alternateAction={
        <>
          {t("registerPrompt")}{" "}
          <Link
            className="font-medium text-slate-950 underline-offset-4 hover:underline"
            href="/auth/register"
          >
            {t("registerLink")}
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthPageShell>
  );
}
