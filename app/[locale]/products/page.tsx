import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getProducts } from "@/lib/woocommerce";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { APP_CONFIG } from "@/lib/config";

function parsePrice(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default async function ProductsPage() {
  const t = await getTranslations("Products");

  let products = [] as Awaited<ReturnType<typeof getProducts>>;
  let fetchError: string | null = null;

  try {
    products = await getProducts({ 
      per_page: APP_CONFIG.products.perPage, 
      status: "publish" 
    });
  } catch (error) {
    fetchError = error instanceof Error ? error.message : "Failed to fetch products";
    console.error("[ProductsPage] Error fetching products:", error);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-12">
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

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const firstImage = product.images[0]?.src;
          const displayPrice = parsePrice(product.price || product.regular_price);

          return (
            <article key={product.id} className="rounded-lg border p-4">
              <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-muted">
                {firstImage ? (
                  <Image
                    src={firstImage}
                    alt={product.name}
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

              <h2 className="line-clamp-2 text-base font-medium">{product.name}</h2>
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
    </main>
  );
}
