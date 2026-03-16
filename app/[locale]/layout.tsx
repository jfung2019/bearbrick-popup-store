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
        <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              href={`/${locale}`}
              className="text-lg font-semibold transition-opacity hover:opacity-80"
              aria-label="Go to homepage"
            >
              BE@RBRICK
            </Link>
            <div className="ml-auto flex items-center gap-14">
              <nav className="flex items-center gap-10 text-lg">
                <Link
                  href={`/${locale}/merchandise`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Merchandise
                </Link>
                <Link
                  href={`/${locale}/membership`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Membership
                </Link>
                <Link
                  href={`/${locale}/fan-engagement`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Community
                </Link>
                <Link
                  href={`/${locale}/payment-types`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Payment
                </Link>
                <Link
                  href={`/${locale}/faq`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </nav>

              <div className="flex items-center gap-7">
              <Link
                  href={`/${locale}/contact`}
                  className="text-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
                <LanguageSwitcher />
                <NavUser />
                <NavCart />
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
