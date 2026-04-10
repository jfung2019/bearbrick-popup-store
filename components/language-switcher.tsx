"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const nativeNames: Record<string, string> = {
    en: "English",
    "zh-hant": "繁體中文",
    "zh-hans": "简体中文",
    ja: "日本語",
    ko: "한국어",
  };
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname?.replace(new RegExp(`^/${locale}`), "");
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label="Change language"
        className="inline-flex size-9 items-center justify-center rounded-md border transition cursor-pointer"
        tabIndex={0}
      >
        <Globe size={24} />
      </button>
      <ul
        className="invisible absolute right-0 z-10 mt-2 w-32 rounded-md border border-input bg-background opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        tabIndex={-1}
      >
        {routing.locales.map((loc) => (
          <li key={loc}>
            <button
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-muted hover:text-yellow-400/90 ${loc === locale ? "font-bold text-yellow-400/90" : "text-foreground"}`}
              onClick={() => {
                switchLocale(loc);
              }}
            >
              {nativeNames[loc] ?? loc}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
