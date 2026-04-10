"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFeaturedSliderAnimation } from "../../hooks/use-featured-slider-animation";

export type FeaturedProduct = {
    id: string;
    name: string;
    desc: string;
    price: string;
    size: string;
    image: string;
    href: string;
};

interface FeaturedProductsProps {
    products: FeaturedProduct[];
    viewAllHref: string;
    viewAllLabel: string;
    title?: string;
    subtitle?: string;
}

export function FeaturedProducts({
    products,
    title = "Featured Products",
    subtitle = "A quick look at the featured items available in our store.",
    viewAllHref,
    viewAllLabel
}: FeaturedProductsProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    useFeaturedSliderAnimation(sliderRef);
    const [scrollIndex, setScrollIndex] = useState(0);
    const visibleCount = 3;
    const canScrollLeft = scrollIndex > 0;
    const canScrollRight = scrollIndex < products.length - visibleCount;

    const scrollTo = (dir: "left" | "right") => {
        if (!sliderRef.current) return;
        const card = sliderRef.current.querySelector(".featured-card");
        if (!card) return;
        const cardWidth = (card as HTMLElement).offsetWidth + 24; // 24px gap
        const newIndex = dir === "left" ? Math.max(0, scrollIndex - 1) : Math.min(products.length - visibleCount, scrollIndex + 1);
        setScrollIndex(newIndex);
        sliderRef.current.scrollTo({ left: newIndex * cardWidth, behavior: "smooth" });
    };

    return (
        <section className="bg-background py-16 sm:py-20 lg:pt-0 lg:pb-24">
            <div className="w-full px-6 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="font-serif text-4xl italic tracking-tight text-foreground sm:text-5xl">
                            {title}
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl text-left">{subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            aria-label="Scroll left"
                            onClick={() => scrollTo("left")}
                            disabled={!canScrollLeft}
                            className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/90 backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            aria-label="Scroll right"
                            onClick={() => scrollTo("right")}
                            disabled={!canScrollRight}
                            className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/90 backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <div
                        ref={sliderRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-2"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="featured-card shrink-0 w-full md:w-92.5 border-white/8 rounded-3xl shadow-xl p-6 border bg-card/80 hover:shadow-2xl transition-shadow duration-300 relative group"
                            >
                                <div className="relative w-full h-100 rounded-2xl overflow-hidden mb-4">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* <button className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-white">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" /></svg>
                                    </button> */}
                                    {/* <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/90 text-white rounded-full px-6 py-2 text-base font-medium shadow hover:bg-black transition-colors">Buy now</button> */}
                                    {/* <span className="absolute bottom-3 right-3 bg-white/90 rounded-full px-4 py-2 text-sm font-semibold text-black shadow">{product.price}</span> */}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-semibold text-xl mb-1 text-foreground">{product.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">{product.desc}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm font-medium text-muted-foreground underline cursor-pointer">{product.size}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-10 flex justify-center">
                    <Link
                        href={viewAllHref}
                        className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
                    >
                        {viewAllLabel}
                    </Link>
                </div>
            </div>
        </section>
    );
}
