"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("languages");
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    // Use regex to only replace locale at the start of the path
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "");
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map((loc) => (
        <Button
          key={loc}
          type="button"
          variant={locale === loc ? "default" : "outline"}
          size="sm"
          onClick={() => switchLocale(loc)}
        >
          {t(loc)}
        </Button>
      ))}
    </div>
  );
}
