import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPostByPostSlug } from "@/lib/wordpress";
import { stripHtmlTags } from "@/lib/utils";

type WhatsOnDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function WhatsOnDetailPage({ params }: WhatsOnDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("Home");

  const post = await getPostByPostSlug(slug);
  console.log("[WhatsOnDetailPage] Fetched post data:", post);
  if (!post) {
    notFound();
  }

  const parsedDate = new Date(post.date);
  const formattedDate = Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  const plainDescription = stripHtmlTags(post.description || post.content);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <Link
          href={`/${locale}/whats-on`}
          className="inline-flex text-sm text-muted-foreground hover:text-foreground"
        >
          ← {t("whatsOn.title")}
        </Link>

        {post.image ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="text-amber-500">{t("whatsOn.newsTag")}</span>
            {formattedDate ? <span>{formattedDate}</span> : null}
          </div>

          <h1 className="font-serif text-4xl italic tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>

          {plainDescription ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{plainDescription}</p>
          ) : null}
        </div>

        <article
          className="max-w-none space-y-4 text-sm leading-7 text-foreground/90"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </main>
  );
}
