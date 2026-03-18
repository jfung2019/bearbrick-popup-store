const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

type WpPost = {
  title?: {
    rendered?: string;
  };
};

type WpCategory = {
  id: number;
};

function stripHtml(value: string) {
  const withDecodedNumericEntities = value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    );

  return withDecodedNumericEntities
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[\u2018\u2019\u201B\u2032]/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getPromoMarqueeItems(
  fallbackItems: string[],
  options?: { perPage?: number; categorySlug?: string }
) {
  if (!WORDPRESS_URL) {
    return fallbackItems;
  }

  const perPage = options?.perPage ?? 3;
  const categorySlug = options?.categorySlug ?? "promotional_headline";
  const base = WORDPRESS_URL.replace(/\/$/, "");

  try {
    const categoryParams = new URLSearchParams({
      slug: categorySlug,
      _fields: "id",
      per_page: "1",
    });

    const categoryResponse = await fetch(
      `${base}/wp-json/wp/v2/categories?${categoryParams.toString()}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!categoryResponse.ok) {
      return fallbackItems;
    }

    const categories = (await categoryResponse.json()) as WpCategory[];
    const categoryId = categories[0]?.id;

    if (!categoryId) {
      return fallbackItems;
    }

    const postParams = new URLSearchParams({
      categories: String(categoryId),
      per_page: String(perPage),
      status: "publish",
      _fields: "title.rendered",
      orderby: "date",
      order: "desc",
    });

    const response = await fetch(`${base}/wp-json/wp/v2/posts?${postParams.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return fallbackItems;
    }

    const posts = (await response.json()) as WpPost[];
    const items = posts
      .map((post) => stripHtml(post.title?.rendered ?? ""))
      .filter(Boolean)
      .slice(0, perPage);

    return items.length > 0 ? items : fallbackItems;
  } catch {
    return fallbackItems;
  }
}
