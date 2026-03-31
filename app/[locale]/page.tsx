import { getTranslations } from "next-intl/server";
import { PromoMarquee } from "@/components/promo-marquee";
import { LuxuryHeroCarousel } from "@/components/luxury-hero-carousel";
import { WhatsOnSection } from "@/components/home/whats-on-section";
import { getPromoMarqueeItems, getBannerHeroSlides, getPostsBySlug } from "@/lib/wordpress";
import { FeaturedProducts, FeaturedProduct } from "@/components/home/featured-products";
import { getProducts } from "@/lib/woocommerce-api";
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

  const whatsOnItems = [
    {
      id: "drop-weekend",
      date: t("whatsOn.items.dropWeekend.date"),
      tag: t("whatsOn.items.dropWeekend.tag"),
      title: t("whatsOn.items.dropWeekend.title"),
      description: t("whatsOn.items.dropWeekend.description"),
      href: `/${locale}/products`,
      ctaLabel: t("whatsOn.items.dropWeekend.cta"),
      imageSrc:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "studio-preview",
      date: t("whatsOn.items.studioPreview.date"),
      tag: t("whatsOn.items.studioPreview.tag"),
      title: t("whatsOn.items.studioPreview.title"),
      description: t("whatsOn.items.studioPreview.description"),
      href: `/${locale}/products`,
      ctaLabel: t("whatsOn.items.studioPreview.cta"),
      imageSrc:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "collector-night",
      date: t("whatsOn.items.collectorNight.date"),
      tag: t("whatsOn.items.collectorNight.tag"),
      title: t("whatsOn.items.collectorNight.title"),
      description: t("whatsOn.items.collectorNight.description"),
      href: `/${locale}/products`,
      ctaLabel: t("whatsOn.items.collectorNight.cta"),
      imageSrc:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const test = await getPostsBySlug("banner");
  console.log("Test fetch posts by slug 'banner':", test);
  const test2 = await getPostsBySlug("promotional_headline");
  console.log("Test2 fetch posts by slug 'promotional_headline':", test2);

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
      <PromoMarquee items={marqueeItems} />
      <LuxuryHeroCarousel heroSlides={heroSlides} locale={locale} />
      <WhatsOnSection
        kicker={t("whatsOn.kicker")}
        title={t("whatsOn.title")}
        description={t("whatsOn.description")}
        viewAllLabel={t("whatsOn.viewAll")}
        viewAllHref={`/${locale}/products`}
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
