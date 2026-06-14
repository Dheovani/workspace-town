import { defineRouting } from "next-intl/routing";

export const locales = ["pt-BR", "en-US"] as const;
export const defaultLocale = "pt-BR";

export type AppLocale = (typeof locales)[number];

export function isAppLocale(locale: string): locale is AppLocale {
  return locales.some((supportedLocale) => supportedLocale === locale);
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});
