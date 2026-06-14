import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function LocaleHomePage() {
  const t = await getTranslations("home");

  redirect(t("redirectTarget"));
}
