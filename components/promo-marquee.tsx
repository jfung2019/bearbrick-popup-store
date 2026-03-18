"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type PromoMarqueeProps = {
  items: string[];
};

export function PromoMarquee({ items }: PromoMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const repeatedItems = [...items, ...items, ...items];

  useLayoutEffect(() => {
    if (!marqueeTrackRef.current) return;

    const track = marqueeTrackRef.current;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(track, {
      duration: 50,
      ease: "none",
      xPercent: -33.333,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={marqueeRef}
      className="relative h-12 overflow-hidden border-b border-white/10 bg-[#0f1113]"
    >
      <div
        ref={marqueeTrackRef}
        className="marquee-track py-3 text-yellow-400/90"
      >
        {repeatedItems.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
