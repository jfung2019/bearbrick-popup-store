"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";

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
    <div className="relative">
      <button
        type="button"
        aria-label="Change language"
        className="flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-muted transition"
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
              {t(loc)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
