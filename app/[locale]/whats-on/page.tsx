import { getTranslations } from "next-intl/server";
import { FeaturedWhatsOnSection } from "@/components/home/featured-whats-on-section";
import { getPostsBySlug } from "@/lib/wordpress";
import { stripHtmlTags } from "@/lib/utils";

export default async function WhatsOnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Home");

  let items: Array<{
    id: string;
    date: string;
    tag: string;
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
    imageSrc: string;
  }> = [];
  let fetchError: string | null = null;

  try {
    const posts = await getPostsBySlug("news");
    items = posts.map((post) => {
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
        href: post.link || `/${locale}/whats-on`,
        ctaLabel: t("whatsOn.readMore"),
        imageSrc: post.image || "/images/medicomtoy_edited.png",
      };
    });
  } catch (error) {
    fetchError = error instanceof Error ? error.message : "Failed to fetch news";
    console.error("[WhatsOnPage] Error fetching news posts:", error);
  }

  return (
    <main className="min-h-screen">
      {fetchError ? (
        <p className="px-6 py-6 text-sm text-destructive sm:px-8 lg:px-10">{t("whatsOn.error")}</p>
      ) : null}
      {!fetchError && items.length === 0 ? (
        <p className="px-6 py-6 text-sm text-muted-foreground sm:px-8 lg:px-10">{t("whatsOn.empty")}</p>
      ) : null}
      <FeaturedWhatsOnSection
        kicker={t("whatsOn.kicker")}
        title={t("whatsOn.title")}
        description={t("whatsOn.description")}
        items={items}
      />
    </main>
  );
}
