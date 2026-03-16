import { HomeSliderTemplate } from "@/components/home-slider-template";

type LocalizedHomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedHomePage({
  params,
}: LocalizedHomePageProps) {
  const { locale } = await params;

  const slides = [
    {
      id: "slide-1",
      imageSrc: "/demo/i1.webp",
      title: "Collectible culture, curated for modern fans",
      description: "Explore premium BE@RBRICK drops, member-first access, and curated stories from the community.",
    },
    {
      id: "slide-2",
      imageSrc: "/demo/i2.png",
      title: "From discovery to checkout in one seamless flow",
      description: "Merchandise, membership, payment options, and support pages are integrated in one consistent brand experience.",
    },
  ];

  return <HomeSliderTemplate locale={locale} slides={slides} />;
}
