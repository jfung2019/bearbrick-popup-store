import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh-hant", "zh-hans", "ja", "ko"],
  defaultLocale: "en",
  localePrefix: "always",
});
