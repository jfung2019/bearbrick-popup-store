import { getTranslations } from "next-intl/server";
import { WhatsOnSection } from "@/components/home/whats-on-section";

export default async function WhatsOnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Home");

  const items = [
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

  return (
    <main className="min-h-screen">
      <WhatsOnSection
        kicker={t("whatsOn.kicker")}
        title={t("whatsOn.title")}
        description={t("whatsOn.description")}
        viewAllLabel={t("whatsOn.viewAll")}
        viewAllHref={`/${locale}/products`}
        items={items}
      />
    </main>
  );
}
