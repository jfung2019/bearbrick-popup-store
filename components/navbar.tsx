import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavCart } from "@/components/cart/nav-cart";
import { NavUser } from "@/components/auth/nav-user";

type NavbarProps = {
  locale: string;
};

export function Navbar({ locale }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/35 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold tracking-[0.08em] transition-opacity hover:opacity-80"
          aria-label="Go to homepage"
        >
          BE@RBRICK
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <div>Merchandise</div>
          <div>What&apos;s On</div>
          <div>About Us</div>
          <LanguageSwitcher />
          <NavUser />
          <NavCart />
        </div>
      </div>
    </header>
  );
}
