import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductGallery } from "@/components/products/product-gallery";
import { getProductBySlug } from "@/lib/woocommerce-api";
import { parsePrice, stripHtmlTags } from "@/lib/utils";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("Products");

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const firstImage = product.images[0]?.src;
  const displayPrice = parsePrice(product.price || product.regular_price);
  const plainDescription = stripHtmlTags(
    product.description || product.short_description || ""
  );

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        <div className="w-full lg:w-1/2 space-y-5">
          <Link href={`/${locale}/products`} className="text-sm text-muted-foreground hover:text-foreground">
            ← {t("title")}
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-lg text-muted-foreground">{t("price", { value: displayPrice.toFixed(2) })}</p>

          {plainDescription ? (
            <p className="max-w-none text-sm text-muted-foreground">
              {plainDescription}
            </p>
          ) : null}

          <div className="pt-2">
            <AddToCartButton
              product={{
                productId: product.id,
                name: product.name,
                price: displayPrice,
                image: firstImage,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
