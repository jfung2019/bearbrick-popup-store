"use client";

import { Globe } from "lucide-react";
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
    <div className="group relative">
      <button
        type="button"
        className="inline-flex size-9 items-center justify-center rounded-md border"
        aria-label="Language selector"
      >
        <Globe className="size-4" />
      </button>

      <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="min-w-44 rounded-md border bg-background p-1 shadow-sm">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => switchLocale(loc)}
              className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm hover:bg-muted ${
                loc === locale ? "font-medium" : "text-muted-foreground"
              }`}
            >
              <span>{t(loc)}</span>
              {loc === locale ? <span className="text-xs">•</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
