import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavCart } from "@/components/cart/nav-cart";
import { NavUser } from "@/components/auth/nav-user";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale}>
        <header className="border-b">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              href={`/${locale}`}
              className="text-lg font-semibold transition-opacity hover:opacity-80"
              aria-label="Go to homepage"
            >
              BE@RBRICK
            </Link>
            <div className="ml-auto flex items-center gap-3">
              <LanguageSwitcher />
              <NavUser />
              <NavCart />
            </div>
          </div>
        </header>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
