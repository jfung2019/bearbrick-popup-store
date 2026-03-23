"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Rednote, Douyin } from './svg/socialIcons';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const t = useTranslations('Footer');
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoRef.current) return;
    let ctx = gsap.context(() => {
      const anim = gsap.fromTo(
        logoRef.current,
        { y: 200, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: logoRef.current,
            start: "top 90%",
            toggleActions: "restart none none none",
            onEnter: () => {
              gsap.fromTo(
                logoRef.current,
                { y: 200, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "bounce.out" }
              );
            },
            onLeaveBack: () => {
              gsap.set(logoRef.current, { y: 200, opacity: 0 });
            },
          },
        }
      );
      return () => anim.kill();
    }, logoRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="w-full bg-[#181818] text-footer-light pt-12 px-4 border-t border-footer-border overflow-hidden">
      <div className="mx-auto w-full flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        {/* Left: Logo and copyright */}
        <div className="flex-1 min-w-55 flex flex-col gap-4 mb-8 md:mb-0">
          <span className="text-2xl font-serif italic text-[#FFD34E] tracking-wide">Medicom LOGO</span>
          <span className="text-xs text-footer-light/70">Subscribe to Newsletter</span>
          <form className="flex gap-2 max-w-xs">
            <div className="relative flex-1">
              <input type="email" placeholder={t('subscribePlaceholder')} className="w-full rounded-none px-4 py-2 bg-[#222] text-footer-light border-0 focus:ring-2 focus:ring-footer-accent placeholder:text-footer-light/60 text-sm ml-4" required />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-footer-light/60 pointer-events-none">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M2 4h20v16H2V4zm2 2v2l8 5 8-5V6l-8 5-8-5z" fill="currentColor" /></svg>
              </span>
            </div>
            <button type="submit" className="bg-black text-white px-5 py-2 rounded-none text-xs font-semibold tracking-widest border border-footer-border hover:bg-footer-accent hover:text-black transition">{t('subscribeButton')}</button>
          </form>
        </div>
        {/* Center: Site Map & Social & Info */}
        <div className="flex-2 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
          <div>
            <h3 className="uppercase text-xs font-bold tracking-widest text-footer-light mb-3">{t('contactUs')}</h3>
            <ul className="space-y-1 text-sm">
              <li>{t('address')}</li>
            </ul>
          </div>
          <div>
            <h3 className="uppercase text-xs font-bold tracking-widest text-footer-light mb-3">{t('social')}</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="https://www.instagram.com/bearbrick.museum/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener" className="flex items-center gap-2 hover:underline">
                  <span className="inline-block w-7 h-7 align-middle">
                    <Instagram />
                  </span>
                  {t('socialLinks.instagram')}
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/profile.php?id=61576952911439" target="_blank" rel="noopener" className="flex items-center gap-2 hover:underline">
                  <span className="inline-block w-7 h-7 align-middle">
                    <Facebook />
                  </span>
                  {t('socialLinks.facebook')}
                </a>
              </li>
              <li>
                <a href="https://xhslink.com/m/1scyTOyx1qC" target="_blank" rel="noopener" className="flex items-center gap-2 hover:underline">
                  <span className="inline-block w-7 h-7 align-middle">
                    <Rednote />
                  </span>
                  {t('socialLinks.rednote')}
                </a>
              </li>
              <li>
                <a href="https://douyin.com" target="_blank" rel="noopener" className="flex items-center gap-2 hover:underline">
                  <span className="inline-block w-7 h-7 align-middle">
                    <Douyin />
                  </span>
                  {t('socialLinks.douyin')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="uppercase text-xs font-bold tracking-widest text-footer-light mb-3">{t('info')}</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/faq" className="hover:underline">{t('infoLinks.faq')}</Link></li>
              <li><Link href="#" className="hover:underline">{t('infoLinks.legal')}</Link></li>
              <li><Link href="#" className="hover:underline">{t('infoLinks.privacy')}</Link></li>
              <li><Link href="#" className="hover:underline">{t('infoLinks.terms')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom: Centered logo with animation */}
      <div ref={logoRef} className="w-full flex justify-center items-center py-16">
        <div className="w-[75vw] max-w-5xl min-w-50">
          <Image
            src="/logo_BB_white.svg"
            alt='BE@RBRICK'
            width={1920}
            height={480}
            priority
            className="invert object-contain w-full h-auto"
          />
        </div>
      </div>
    </footer>
  );
}
