import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getProducts } from "@/lib/woocommerce-api";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { APP_CONFIG } from "@/lib/config";

function parsePrice(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Products");
  const tFilter = await getTranslations("Products.filter");

  let products = [] as Awaited<ReturnType<typeof getProducts>>;
  let fetchError: string | null = null;

  try {
    products = await getProducts({
      per_page: APP_CONFIG.products.perPage,
      status: "publish",
    });
  } catch (error) {
    fetchError = error instanceof Error ? error.message : "Failed to fetch products";
    console.error("[ProductsPage] Error fetching products:", error);
  }

  return (
    <main className="flex min-h-screen w-full flex-row gap-8 px-6 py-12">
      {/* Filter Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-lg borde p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">{tFilter("title")}</h2>
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{tFilter("category.label")}</label>
              <select className="w-full rounded border px-2 py-1 text-sm bg-zinc-900 text-white border-zinc-700 focus:ring-2 focus:ring-zinc-600">
                <option>{tFilter("category.all")}</option>
                <option>{tFilter("category.100")}</option>
                <option>{tFilter("category.400")}</option>
                <option>{tFilter("category.1000")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{tFilter("price.label")}</label>
              <div className="flex gap-2">
                <input type="number" placeholder={tFilter("price.min")}
                  className="w-1/2 rounded border px-2 py-1 text-sm" />
                <input type="number" placeholder={tFilter("price.max")}
                  className="w-1/2 rounded border px-2 py-1 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{tFilter("sort.label")}</label>
              <select className="w-full rounded border px-2 py-1 text-sm bg-zinc-900 text-white border-zinc-700 focus:ring-2 focus:ring-zinc-600">
                <option>{tFilter("sort.relevance")}</option>
                <option>{tFilter("sort.priceLow")}</option>
                <option>{tFilter("sort.priceHigh")}</option>
                <option>{tFilter("sort.nameAZ")}</option>
                <option>{tFilter("sort.nameZA")}</option>
              </select>
            </div>
            <button type="button" className="mt-2 rounded bg-black px-4 py-2 text-white text-sm font-medium">{tFilter("apply")}</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {fetchError ? (
          <p className="rounded-md border border-destructive/40 p-4 text-sm text-destructive">
            {t("error")}
          </p>
        ) : null}

        {!fetchError && products.length === 0 ? (
          <p className="rounded-md border p-4 text-sm text-muted-foreground">
            {t("empty")}
          </p>
        ) : null}

        <section className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const firstImage = product.images[0]?.src;
            const displayPrice = parsePrice(product.price || product.regular_price);
            const displayName = product.name;

            return (
              <article key={product.id} className="rounded-lg border p-3 bg-zinc-900 flex flex-col">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-muted">
                {firstImage ? (
                  <Image
                    src={firstImage}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes={APP_CONFIG.products.defaultImageSize}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    {t("imageFallback")}
                  </div>
                )}
              </div>

                <h2 className="line-clamp-2 text-base font-medium">{displayName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("price", { value: displayPrice.toFixed(2) })}
                </p>

                <div className="mt-4">
                  <AddToCartButton
                    product={{
                      productId: product.id,
                      name: product.name,
                      price: displayPrice,
                      image: firstImage,
                    }}
                  />
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
