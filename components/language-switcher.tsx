"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("languages");
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "");
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div>
      <label className="sr-only" htmlFor="language-selector">
        Language
      </label>
      <select
        id="language-selector"
        value={locale}
        onChange={(event) => switchLocale(event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        aria-label="Language selector"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}
