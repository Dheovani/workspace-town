import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/config";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return children;
}
