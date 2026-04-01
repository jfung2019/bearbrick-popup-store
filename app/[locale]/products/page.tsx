import { getTranslations } from "next-intl/server";
import { getProducts } from "@/lib/woocommerce-api";
import { ProductsPage as Product } from "@/components/products/products-page";
import { APP_CONFIG } from "@/lib/config";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  await getTranslations("Products"); // ensure translations are loaded for locale

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

  return <Product initialProducts={products} fetchError={fetchError} />;
}

