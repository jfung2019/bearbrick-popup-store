import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavCart } from "@/components/cart/nav-cart";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const wordpressBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");
  const loginHref = wordpressBaseUrl ? `${wordpressBaseUrl}/my-account` : `/${locale}`;

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
              <Link
                href={loginHref}
                aria-label="Login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-md border"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20a8 8 0 0 1 16 0" />
                </svg>
              </Link>
              <NavCart />
            </div>
          </div>
        </header>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
