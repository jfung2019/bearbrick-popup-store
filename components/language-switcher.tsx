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
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "");
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Change language"
        className="inline-flex size-9 items-center justify-center rounded-md border transition"
        tabIndex={0}
        onClick={() => {
          const menu = document.getElementById('locale-menu');
          if (menu) menu.classList.toggle('hidden');
        }}
      >
        <Globe size={24} />
      </button>
      <ul
        id="locale-menu"
        className="absolute right-0 mt-2 w-32 bg-background border border-input rounded-md shadow-lg hidden z-10"
        tabIndex={-1}
      >
        {routing.locales.map((loc) => (
          <li key={loc}>
            <button
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${loc === locale ? 'font-bold' : ''}`}
              onClick={() => {
                switchLocale(loc);
                const menu = document.getElementById('locale-menu');
                if (menu) menu.classList.add('hidden');
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
