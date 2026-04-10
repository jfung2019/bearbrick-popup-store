import axios from "axios";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export type WPBannerHeroSlide = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  accent: string;
  href?: string;
  ctaLabel?: string;
};

export type WPPromoMarqueeItems = string[];

export type WPPostBySlug = {
  id: number;
  title: string;
  slug: string;
  date: string;
  link: string;
  image: string | null;
  description: string;
  content: string;
  ctaPath?: string;
  ctaLabel?: string;
};

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function mapWordPressPost(post: any): WPPostBySlug {
  const content = post.content.rendered;
  const wpAdvanceCustomField = post?.acf ?? {};

  let imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  if (!imageUrl) {
    const imgMatch = content.match(/<img.*?src=["'](.*?)["']/);
    imageUrl = imgMatch ? imgMatch[1] : null;
  }

  let description = "";
  const figcaptionMatch = content.match(/<figcaption.*?>(.*?)<\/figcaption>/);
  const pMatch = content.match(/<p.*?>(.*?)<\/p>/);

  if (figcaptionMatch) {
    description = figcaptionMatch[1].replace(/<[^>]*>?/gm, "");
  } else if (pMatch) {
    description = pMatch[1].replace(/<[^>]*>?/gm, "");
  }

  const ctaPath =
    normalizeOptionalString(wpAdvanceCustomField.cta_path) ??
    normalizeOptionalString(wpAdvanceCustomField.cta_url) ??
    normalizeOptionalString(wpAdvanceCustomField.cta_link?.url);

  const ctaLabel =
    normalizeOptionalString(wpAdvanceCustomField.cta_label) ??
    normalizeOptionalString(wpAdvanceCustomField.cta_link?.title);

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    date: post.date,
    link: post.link,
    image: imageUrl,
    description,
    content,
    ctaPath,
    ctaLabel,
  };
}

// use axious, move to custom hook folder, add loading state, error handling, and unit tests.
export async function getBannerHeroSlides(
  fallbackSlides: WPBannerHeroSlide[],
  options?: { perPage?: number; categorySlug?: string }
): Promise<WPBannerHeroSlide[]> {
  const categorySlug = options?.categorySlug ?? "banner";
  const perPage = options?.perPage ?? 3;
  try {
    const posts = await getPostsBySlug(categorySlug);
    const slides: WPBannerHeroSlide[] = posts
      .map((post: any): WPBannerHeroSlide => ({
        id: String(post.id),
        title: post.title,
        description: post.description,
        imageSrc: post.image ?? "",
        accent: "bg-[#d9c293]", // You can customize or randomize accent if needed
        href: post.ctaPath,
        ctaLabel: post.ctaLabel,
      }))
      .filter((slide: WPBannerHeroSlide) => slide.imageSrc)
      .slice(0, perPage);
    return slides.length > 0 ? slides : fallbackSlides;
  } catch {
    return fallbackSlides;
  }
}

export async function getPromoMarqueeItems(
  fallbackItems: WPPromoMarqueeItems,
  options?: { categorySlug: string, perPage?: number; }
): Promise<WPPromoMarqueeItems> {
  const categorySlug = options?.categorySlug;
  const perPage = options?.perPage ?? 5;
  try {
    const posts = await getPostsBySlug(categorySlug || 'promotional_headline');
    const items: WPPromoMarqueeItems = posts
      .map((post: any) => post.title)
      .filter(Boolean)
      .slice(0, perPage);
    return items.length > 0 ? items : fallbackItems;
  } catch {
    return fallbackItems;
  }
}

export async function getPostsBySlug(
  slug: string,
  options?: { perPage?: number }
): Promise<WPPostBySlug[]> {
  const WP_URL = `${WORDPRESS_URL}/wp-json/wp/v2`;
  const perPage = options?.perPage ?? 100;
  try {
    const catRes = await axios.get(`${WP_URL}/categories?slug=${slug}`);
    const categories = catRes.data;
    if (!categories || categories.length === 0) return [];

    const allPosts: any[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const postsRes = await axios.get(`${WP_URL}/posts`, {
        params: {
          categories: categories[0].id,
          _embed: true,
          per_page: perPage,
          page,
        },
      });

      const posts = postsRes.data ?? [];
      allPosts.push(...posts);
      totalPages = Number(postsRes.headers?.["x-wp-totalpages"] ?? 1);
      page += 1;
    } while (page <= totalPages);

    return allPosts.map((post: any): WPPostBySlug => mapWordPressPost(post));
  } catch (error) {
    // Optionally log error details here
    return [];
  }
}

export async function getPostByPostSlug(slug: string): Promise<WPPostBySlug | null> {
  const WP_URL = `${WORDPRESS_URL}/wp-json/wp/v2`;

  try {
    const response = await axios.get(`${WP_URL}/posts`, {
      params: {
        slug,
        _embed: true,
        per_page: 1,
      },
    });

    const post = response.data?.[0];
    if (!post) {
      return null;
    }

    return mapWordPressPost(post);
  } catch {
    return null;
  }
}

export async function getPostsBySlugs(
  slugs: string[],
  options?: { perPage?: number; match?: "any" | "all" }
): Promise<WPPostBySlug[]> {
  const uniqueSlugs = Array.from(new Set(slugs.filter(Boolean)));
  const match = options?.match ?? "any";

  if (uniqueSlugs.length === 0) {
    return [];
  }

  const postsBySlug = await Promise.all(
    uniqueSlugs.map((slug) => getPostsBySlug(slug, options))
  );

  const merged = postsBySlug.flat();
  const postById = new Map<number, WPPostBySlug>();
  const countById = new Map<number, number>();

  for (const post of merged) {
    if (!postById.has(post.id)) {
      postById.set(post.id, post);
    }

    countById.set(post.id, (countById.get(post.id) ?? 0) + 1);
  }

  const requiredCount = match === "all" ? uniqueSlugs.length : 1;

  return Array.from(postById.values())
    .filter((post) => (countById.get(post.id) ?? 0) >= requiredCount)
    .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
}
