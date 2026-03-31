import axios from "axios";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export type WPBannerHeroSlide = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  accent: string;
};

export type WPPromoMarqueeItems = string[];

export type WPPostBySlug = {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  description: string;
  content: string;
};

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

export async function getPostsBySlug(slug: string): Promise<WPPostBySlug[]> {
  const WP_URL = `${WORDPRESS_URL}/wp-json/wp/v2`;
  try {
    const catRes = await axios.get(`${WP_URL}/categories?slug=${slug}`);
    const categories = catRes.data;
    if (!categories || categories.length === 0) return [];

    const postsRes = await axios.get(`${WP_URL}/posts?categories=${categories[0].id}&_embed`);
    const posts = postsRes.data;

    return posts.map((post: any): WPPostBySlug => {
      const content = post.content.rendered;

      // 1. Get Image (Featured first, then fallback to content)
      let imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      if (!imageUrl) {
        const imgMatch = content.match(/<img.*?src=["'](.*?)["']/);
        imageUrl = imgMatch ? imgMatch[1] : null;
      }

      // 2. Get Caption/Description Text
      let description = "";
      const figcaptionMatch = content.match(/<figcaption.*?>(.*?)<\/figcaption>/);
      const pMatch = content.match(/<p.*?>(.*?)<\/p>/);

      if (figcaptionMatch) {
        description = figcaptionMatch[1].replace(/<[^>]*>?/gm, '');
      } else if (pMatch) {
        description = pMatch[1].replace(/<[^>]*>?/gm, '');
      }

      return {
        id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        image: imageUrl,
        description: description,
        content: content,
      };
    });
  } catch (error) {
    // Optionally log error details here
    return [];
  }
}
