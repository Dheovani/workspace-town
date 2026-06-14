import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isAppLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale =
    requestedLocale && isAppLocale(requestedLocale)
      ? requestedLocale
      : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
