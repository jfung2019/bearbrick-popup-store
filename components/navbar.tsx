"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { AlignJustify, ChevronDown, Search, X } from "lucide-react";
import gsap from "gsap";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavCart } from "@/components/cart/nav-cart";
import { NavUser } from "@/components/auth/nav-user";
import { routing } from "@/i18n/routing";

type NavbarProps = {
  locale: string;
};

type NavKey = "home" | "shop" | "whatsOn" | "aboutUs" | "contact";

const NAV_LINKS: { key: NavKey; path: string }[] = [
  { key: "home", path: "" },
  { key: "shop", path: "/products" },
  { key: "whatsOn", path: "/whats-on" },
  { key: "aboutUs", path: "/about" },
  { key: "contact", path: "/contact" },
];

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("Navbar");
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const nativeNames: Record<string, string> = {
    en: "English",
    "zh-hant": "繁體中文",
    "zh-hans": "简体中文",
    ja: "日本語",
    ko: "한국어",
  };

  const panelRef = useRef<HTMLDivElement>(null);
  const itemEls = useRef<(HTMLLIElement | null)[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const lockPageScroll = () => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };

  const unlockPageScroll = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  // Build the GSAP timeline once after mount
  useEffect(() => {
    const panel = panelRef.current;
    const items = itemEls.current.filter(Boolean) as HTMLLIElement[];
    const bottom = bottomRef.current;
    if (!panel) return;

    gsap.set(panel, { xPercent: 100 });
    gsap.set(items, { opacity: 0, y: 28 });
    if (bottom) gsap.set(bottom, { opacity: 0, y: 10 });

    tlRef.current = gsap
      .timeline({ paused: true, defaults: { ease: "power3.inOut" } })
      .to(panel, { xPercent: 0, duration: 0.55 })
      .to(items, { opacity: 1, y: 0, duration: 0.38, stagger: 0.07 }, "-=0.25")
      .to(bottom, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1");

    return () => {
      tlRef.current?.kill();
    };
  }, []);

  // Play / reverse whenever isOpen changes
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (isOpen) {
      tl.eventCallback("onReverseComplete", null);
      tl.timeScale(1).play();
      lockPageScroll();
    } else {
      tl.eventCallback("onReverseComplete", unlockPageScroll);
      tl.timeScale(1.4).reverse();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      unlockPageScroll();
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = () => {
    setIsOpen(false);
    setIsMembershipOpen(false);
    setIsLanguageOpen(false);
  };

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname?.replace(new RegExp(`^/${activeLocale}`), "") || "";
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    close();
    router.push(newPath);
  };

  return (
    <>
      {/* ── Sticky header bar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/35 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="shrink-0 transition-opacity hover:opacity-80"
            aria-label="Go to homepage"
          >
            <Image
              src="/bearbrick_logo_sample.png"
              alt="BE@RBRICK"
              width={746}
              height={159}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <nav className="ml-auto hidden items-center gap-3 md:flex">
            {NAV_LINKS.map(({ key, path }) => (
              <Link
                key={key}
                href={`/${locale}${path}`}
                className="text-sm text-white/80 transition-colors hover:text-white"
              >
                {t(key)}
              </Link>
            ))}
            <LanguageSwitcher />
            <NavUser />
            <NavCart />
          </nav>

          {/* Mobile: cart + Menu button */}
          <div className="ml-auto flex items-center gap-4 md:hidden">
            <button
              onClick={() => {
                setIsMembershipOpen(false);
                setIsLanguageOpen(false);
                setIsOpen(true);
              }}
              aria-label={t("menu")}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/90 transition-opacity hover:opacity-70"
            >
              {t("menu")}
              <AlignJustify className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-screen mobile menu panel ───────────────────────────── */}
      <div
        id="mobile-menu"
        ref={panelRef}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black px-8 pb-8 pt-6 md:hidden"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <button
          onClick={close}
          aria-label="Close menu"
          className="sticky top-6 z-20 ml-auto text-white/70 transition-colors hover:text-white"
        >
          <X className="size-6" />
        </button>

        {/* Panel header row */}
        <div className="flex items-center">
          <Link
            href={`/${locale}`}
            onClick={close}
            className="transition-opacity hover:opacity-80"
            aria-label="Go to homepage"
          >
            <Image
              src="/bearbrick_logo_sample.png"
              alt="BE@RBRICK"
              width={746}
              height={159}
              className="h-7 w-auto"
            />
          </Link>
        </div>
        {/* Large stacked nav items */}
        <nav className="mt-6 flex-1" aria-label="Mobile navigation">
          <ul>
            {NAV_LINKS.map(({ key, path }, i) => (
              <li
                key={key}
                ref={(el) => {
                  itemEls.current[i] = el;
                }}
                className="border-b border-white/15"
              >
                <Link
                  href={`/${locale}${path}`}
                  onClick={close}
                  className="block py-5 text-[2.55rem] font-light leading-tight tracking-tight text-white transition-colors hover:text-white/55 sm:text-6xl"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
            <li
              ref={(el) => {
                itemEls.current[NAV_LINKS.length] = el;
              }}
              className="border-b border-white/15"
            >
              <button
                type="button"
                onClick={() => setIsMembershipOpen((prev) => !prev)}
                aria-expanded={isMembershipOpen}
                className="flex w-full items-center justify-between py-5 text-left text-[2.55rem] font-light leading-tight tracking-tight text-white transition-colors hover:text-white/55 sm:text-6xl"
              >
                {t("membership")}
                <ChevronDown
                  className={`size-7 shrink-0 transition-transform ${isMembershipOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${isMembershipOpen ? "max-h-36 pb-5" : "max-h-0"}`}
              >
                <div className="flex flex-col gap-3 pl-1">
                  <Link
                    href={`/${locale}/register`}
                    onClick={close}
                    className="text-base font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {t("signUp")}
                  </Link>
                  <Link
                    href={`/${locale}/login`}
                    onClick={close}
                    className="text-base font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {t("logIn")}
                  </Link>
                </div>
              </div>
            </li>
            <li
              ref={(el) => {
                itemEls.current[NAV_LINKS.length + 1] = el;
              }}
              className="border-b border-white/15"
            >
              <Link
                href={`/${locale}/cart`}
                onClick={close}
                className="block py-5 text-[2.55rem] font-light leading-tight tracking-tight text-white transition-colors hover:text-white/55 sm:text-6xl"
              >
                {t("myCart")}
              </Link>
            </li>
            <li
              ref={(el) => {
                itemEls.current[NAV_LINKS.length + 2] = el;
              }}
              className="border-b border-white/15"
            >
              <button
                type="button"
                onClick={() => setIsLanguageOpen((prev) => !prev)}
                aria-expanded={isLanguageOpen}
                className="flex w-full items-center justify-between py-5 text-left text-[2.55rem] font-light leading-tight tracking-tight text-white transition-colors hover:text-white/55 sm:text-6xl"
              >
                {t("language")}
                <ChevronDown
                  className={`size-7 shrink-0 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${isLanguageOpen ? "max-h-72 pb-5" : "max-h-0"}`}
              >
                <div className="flex flex-col gap-3 pl-1">
                  {routing.locales.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => switchLocale(loc)}
                      className={`text-left text-base font-medium transition-colors hover:text-white ${loc === activeLocale ? "text-white" : "text-white/75"
                        }`}
                    >
                      {nativeNames[loc] ?? loc}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          </ul>
        </nav>

        {/* Bottom: search */}
        <div ref={bottomRef} className="mt-6 space-y-5">
          <label className="flex cursor-text items-center gap-3 border-b border-white/20 pb-3">
            <Search className="size-4 shrink-0 text-white/40" />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent text-sm text-white/70 placeholder:text-white/35 focus:outline-none"
            />
          </label>
        </div>
      </div>
    </>
  );
}
