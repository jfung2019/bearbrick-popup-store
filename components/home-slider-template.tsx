"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook, Instagram, MessageCircle, Youtube } from "lucide-react";

type Slide = {
  id: string;
  imageSrc: string;
  title: string;
  description: string;
};

type HomeSliderTemplateProps = {
  locale: string;
  slides: Slide[];
};

const AUTO_ROTATE_MS = 5200;

export function HomeSliderTemplate({ locale, slides }: HomeSliderTemplateProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[calc(100svh-73px)] overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 z-0 bg-black">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={slide.imageSrc}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
              </div>
            );
          })}
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-73px)] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 sm:px-8 lg:px-10">
          <div className="max-w-3xl space-y-4 text-white">
            <p className="inline-flex rounded-full border border-white/35 bg-black/25 px-4 py-1 text-xs font-semibold tracking-[0.24em] uppercase text-white">
              Spring Capsule Now Live
            </p>
            <p className="text-xs font-medium tracking-[0.24em] uppercase text-white/80">BE@RBRICK Pop-up Store</p>
            <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              {slides[activeIndex]?.title}
            </h1>
            <p className="text-base leading-7 text-white/80 sm:text-lg">{slides[activeIndex]?.description}</p>
            <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Limited-time headline: Members receive early access and priority checkout.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                href={`/${locale}/membership`}
                className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-black"
              >
                Join Membership
              </Link>
              <Link
                href={`/${locale}/newsletter`}
                className="inline-flex h-11 items-center rounded-full border border-white/30 bg-black/20 px-6 text-sm font-semibold text-white"
              >
                Subscribe Newsletter
              </Link>
              <Link
                href={`/${locale}/merchandise`}
                className="inline-flex h-11 items-center rounded-full border border-white/30 bg-black/20 px-6 text-sm font-semibold text-white"
              >
                Browse Merchandise
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[calc(100svh-73px)] overflow-hidden border-b">
        <Image
          src="/demo/i1.webp"
          alt="Featured collection background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-73px)] max-w-7xl flex-col justify-end px-6 pb-16 pt-20 sm:px-8 lg:px-10">
          <p className="text-xs tracking-[0.24em] uppercase text-white/80">Featured Collection</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Curated merchandise highlights</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            Discover new arrivals, limited editions, and collector essentials with a premium browsing experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/merchandise`} className="inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-medium text-black">
              Explore Merchandise
            </Link>
            <Link href={`/${locale}/payment-types`} className="inline-flex h-11 items-center rounded-md border border-white/40 bg-black/15 px-5 text-sm font-medium text-white">
              Payment Types
            </Link>
          </div>
        </div>
      </section>

      <section className="relative min-h-[calc(100svh-73px)] overflow-hidden border-b">
        <Image
          src="/demo/i2.png"
          alt="Membership background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/70" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-73px)] max-w-7xl grid-cols-1 items-center px-6 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div className="space-y-4 text-white">
            <p className="text-xs tracking-[0.24em] uppercase text-white/80">Membership</p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Join the collectors club</h2>
            <p className="max-w-xl text-sm text-white/80 sm:text-base">
              Sign up with mobile or email, regular login, and social sign-in options for a frictionless member journey.
            </p>
            <Link href={`/${locale}/membership`} className="inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-medium text-black">
              Membership Signup
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 rounded-xl border border-white/25 bg-black/20 p-4 text-white/90 lg:mt-0">
            <div className="rounded-md border border-white/20 p-3 text-sm">Mobile / Email Signup</div>
            <div className="rounded-md border border-white/20 p-3 text-sm">Regular Login</div>
            <div className="rounded-md border border-white/20 p-3 text-sm">Google Sign-in</div>
            <div className="rounded-md border border-white/20 p-3 text-sm">WeChat Sign-in</div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[calc(100svh-73px)] overflow-hidden border-b">
        <Image
          src="/demo/i1.webp"
          alt="Community and support background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/65" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-73px)] max-w-7xl flex-col justify-between px-6 py-16 sm:px-8 lg:px-10">
          <div>
            <p className="text-xs tracking-[0.24em] uppercase text-white/80">Community & Support</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Fan engagement and customer help</h2>
            <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
              Build fan participation, provide direct contact channels, and surface key policy pages in one clear destination.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/fan-engagement`}
              className="inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-medium text-black"
            >
              Fan Engagement
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex h-11 items-center rounded-md border border-white/40 bg-black/15 px-5 text-sm font-medium text-white"
            >
              Contact Form
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="inline-flex h-11 items-center rounded-md border border-white/40 bg-black/15 px-5 text-sm font-medium text-white"
            >
              FAQ
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="inline-flex h-11 items-center rounded-md border border-white/40 bg-black/15 px-5 text-sm font-medium text-white"
            >
              T&C
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/30">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:px-8 lg:grid-cols-3 lg:px-10">
          <div>
            <p className="text-xl font-semibold">BE@RBRICK</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Contemporary collectible culture with curated drops, member access, and global fan community.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex size-10 items-center justify-center rounded-md border bg-background">
                <Instagram className="size-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex size-10 items-center justify-center rounded-md border bg-background">
                <Facebook className="size-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="inline-flex size-10 items-center justify-center rounded-md border bg-background">
                <Youtube className="size-4" />
              </a>
              <a href="https://wechat.com" target="_blank" rel="noreferrer" aria-label="WeChat" className="inline-flex size-10 items-center justify-center rounded-md border bg-background">
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Support</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href={`/${locale}/contact`} className="hover:underline">Contact Form</Link></li>
              <li><Link href={`/${locale}/faq`} className="hover:underline">FAQ</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:underline">T&C</Link></li>
              <li><Link href={`/${locale}/payment-types`} className="hover:underline">Payment Types</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Newsletter</p>
            <p className="mt-3 text-sm text-muted-foreground">Get release alerts and member updates.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/${locale}/newsletter`} className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                Subscribe
              </Link>
              <Link href={`/${locale}/membership`} className="inline-flex h-10 items-center rounded-md border bg-background px-4 text-sm font-medium">
                Join Membership
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
