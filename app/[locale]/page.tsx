import { getTranslations } from "next-intl/server";
import { PromoMarquee } from "@/components/promo-marquee";
import { LuxuryHeroCarousel } from "@/components/luxury-hero-carousel";
import { FeaturedWhatsOnSection } from "@/components/home/featured-whats-on-section";
import { getPromoMarqueeItems, getBannerHeroSlides, getPostsBySlugs } from "@/lib/wordpress";
import { FeaturedProducts, FeaturedProduct } from "@/components/home/featured-products";
import { getProducts } from "@/server/woocommerce";
import { stripHtmlTags } from "@/lib/utils";
import ContactPage from "./contact/page";


type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({
  params,
}: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations("Home");
  const fallbackMarqueeItems = [
    "FALLBACK DATA"
  ];
  const marqueeItems = await getPromoMarqueeItems(fallbackMarqueeItems, { categorySlug: "promotional_headline" });
  const hasPromoMarquee = marqueeItems.length > 0;

  const fallbackHeroSlides = [
    {
      id: "atelier",
      eyebrow: t("hero.slides.atelier.eyebrow"),
      title: t("hero.slides.atelier.title"),
      description: t("hero.slides.atelier.description"),
      ctaLabel: t("hero.slides.atelier.cta"),
      href: `/${locale}/products`,
      imageSrc:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80",
      accent: "bg-[#d9c293]",
    },
    {
      id: "midnight",
      eyebrow: t("hero.slides.midnight.eyebrow"),
      title: t("hero.slides.midnight.title"),
      description: t("hero.slides.midnight.description"),
      ctaLabel: t("hero.slides.midnight.cta"),
      href: `/${locale}/products`,
      imageSrc:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
      accent: "bg-[#8aa9c5]",
    },
    {
      id: "salon",
      eyebrow: t("hero.slides.salon.eyebrow"),
      title: t("hero.slides.salon.title"),
      description: t("hero.slides.salon.description"),
      ctaLabel: t("hero.slides.salon.cta"),
      href: `/${locale}/products`,
      imageSrc:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=80",
      accent: "bg-[#f3ead5]",
    },
  ];

  const heroSlides = await getBannerHeroSlides(fallbackHeroSlides, { categorySlug: "banner" });

  const wpWhatsOnPosts = await getPostsBySlugs(["news", "featured"], {
    perPage: 6,
    match: "all",
  });

  const whatsOnItems = (wpWhatsOnPosts.length > 0
    ? wpWhatsOnPosts
    : await getPostsBySlugs(["news"], { perPage: 6 })
  )
    .slice(0, 3)
    .map((post) => {
      const parsedDate = new Date(post.date);
      const formattedDate = Number.isNaN(parsedDate.getTime())
        ? ""
        : parsedDate.toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

      return {
        id: String(post.id),
        date: formattedDate,
        tag: t("whatsOn.newsTag"),
        title: post.title,
        description: post.description || stripHtmlTags(post.content),
        href: `/${locale}/whats-on/${post.slug}`,
        ctaLabel: t("whatsOn.readMore"),
        imageSrc: post.image || "/images/medicomtoy_edited.png",
      };
    });

  // debug
  // const test = await getPostsBySlug("banner");
  // console.log("Test fetch posts by slug 'banner':", test);
  // const test2 = await getPostsBySlug("promotional_headline");
  // console.log("Test2 fetch posts by slug 'promotional_headline':", test2);

  // Fetch featured products using WooCommerce's built-in 'featured' flag
  async function fetchFeaturedProducts(): Promise<FeaturedProduct[]> {
    try {
      const wcProducts = await getProducts({ featured: true });
      return wcProducts.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        desc: p.slug.replace(/-/g, ' '),
        price: p.price ? `$${p.price}` : '',
        size: '',
        image: p.images?.[0]?.src || '/images/placeholder.jpg',
        href: `/products/${p.slug}`,
      }));
    } catch (e) {
      // fallback to empty or static
      return [];
    }
  }

  // In your HomePage function:
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <main>
      {hasPromoMarquee && <PromoMarquee items={marqueeItems} />}
      <LuxuryHeroCarousel heroSlides={heroSlides} locale={locale} hasPromoMarquee={hasPromoMarquee} />
      <FeaturedWhatsOnSection
        kicker={t("whatsOn.kicker")}
        title={t("whatsOn.title")}
        description={t("whatsOn.description")}
        viewAllLabel={t("whatsOn.viewAll")}
        viewAllHref={`/${locale}/whats-on`}
        items={whatsOnItems}
      />
      {/* Featured Products Section */}
      <FeaturedProducts
        products={featuredProducts}
        viewAllHref={`/${locale}/products`}
        viewAllLabel={t("FeaturedProducts.viewAll")}
      />
      <ContactPage />
    </main>
  );
}
