import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
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
    <AuthPageShell
      appName={common("appName")}
      title={t("title")}
      description={t("description")}
      alternateAction={
        <>
          {t("loginPrompt")}{" "}
          <Link
            className="font-medium text-slate-950 underline-offset-4 hover:underline"
            href="/auth/login"
          >
            {t("loginLink")}
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
