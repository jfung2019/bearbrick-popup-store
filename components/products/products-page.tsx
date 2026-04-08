"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { WooCommerceProduct } from "@/server/woocommerce";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { APP_CONFIG } from "@/lib/config";
import { parsePrice } from "@/lib/utils";

const CATEGORY_VALUES = ["all", "100", "400", "1000"] as const;
type CategoryValue = (typeof CATEGORY_VALUES)[number];

type SortOption = "relevance" | "priceLow" | "priceHigh" | "nameAZ" | "nameZA";

type Props = {
  initialProducts: WooCommerceProduct[];
  fetchError?: string | null;
};

export function ProductsPage({ initialProducts, fetchError }: Props) {
  const t = useTranslations("Products");
  const tFilter = useTranslations("Products.filter");
  const locale = useLocale();

  // Pending filter state (updated as user interacts)
  const [category, setCategory] = useState<CategoryValue>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");

  // Applied filter state (committed on Apply click)
  const [appliedCategory, setAppliedCategory] = useState<CategoryValue>("all");
  const [appliedMin, setAppliedMin] = useState("");
  const [appliedMax, setAppliedMax] = useState("");
  const [appliedSort, setAppliedSort] = useState<SortOption>("relevance");

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category: match against WooCommerce category slug or name (e.g. slug "100" or name "100%")
    if (appliedCategory !== "all") {
      result = result.filter((p) =>
        p.categories?.some(
          (c) =>
            c.slug === appliedCategory ||
            c.name === `${appliedCategory}%` ||
            c.name === appliedCategory
        )
      );
    }

    // Price range
    const min = Number.parseFloat(appliedMin);
    const max = Number.parseFloat(appliedMax);
    if (Number.isFinite(min)) {
      result = result.filter(
        (p) => parsePrice(p.price || p.regular_price) >= min
      );
    }
    if (Number.isFinite(max)) {
      result = result.filter(
        (p) => parsePrice(p.price || p.regular_price) <= max
      );
    }

    // Sort
    switch (appliedSort) {
      case "priceLow":
        result.sort(
          (a, b) =>
            parsePrice(a.price || a.regular_price) -
            parsePrice(b.price || b.regular_price)
        );
        break;
      case "priceHigh":
        result.sort(
          (a, b) =>
            parsePrice(b.price || b.regular_price) -
            parsePrice(a.price || a.regular_price)
        );
        break;
      case "nameAZ":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameZA":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [initialProducts, appliedCategory, appliedMin, appliedMax, appliedSort]);

  function handleApply() {
    setAppliedCategory(category);
    setAppliedMin(minPrice);
    setAppliedMax(maxPrice);
    setAppliedSort(sort);
  }

  return (
    <main className="flex min-h-screen w-full flex-row gap-8 px-6 py-12">
      {/* Filter Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">{tFilter("title")}</h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleApply();
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                {tFilter("category.label")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryValue)}
                className="w-full rounded border px-2 py-1 text-sm bg-zinc-900 text-white border-zinc-700 focus:ring-2 focus:ring-zinc-600"
              >
                <option value="all">{tFilter("category.all")}</option>
                <option value="100">{tFilter("category.100")}</option>
                <option value="400">{tFilter("category.400")}</option>
                <option value="1000">{tFilter("category.1000")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {tFilter("price.label")}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder={tFilter("price.min")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 rounded border px-2 py-1 text-sm bg-zinc-900 text-white border-zinc-700"
                />
                <input
                  type="number"
                  min={0}
                  placeholder={tFilter("price.max")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 rounded border px-2 py-1 text-sm bg-zinc-900 text-white border-zinc-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {tFilter("sort.label")}
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="w-full rounded border px-2 py-1 text-sm bg-zinc-900 text-white border-zinc-700 focus:ring-2 focus:ring-zinc-600"
              >
                <option value="relevance">{tFilter("sort.relevance")}</option>
                <option value="priceLow">{tFilter("sort.priceLow")}</option>
                <option value="priceHigh">{tFilter("sort.priceHigh")}</option>
                <option value="nameAZ">{tFilter("sort.nameAZ")}</option>
                <option value="nameZA">{tFilter("sort.nameZA")}</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 rounded bg-black px-4 py-2 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              {tFilter("apply")}
            </button>
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

        {!fetchError && filteredProducts.length === 0 ? (
          <p className="rounded-md border p-4 text-sm text-muted-foreground">
            {t("empty")}
          </p>
        ) : null}

        <section className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const firstImage = product.images[0]?.src;
            const displayPrice = parsePrice(product.price || product.regular_price);
            const displayName = product.name;

            return (
              <article
                key={product.id}
                className="rounded-lg border p-3 bg-zinc-900 flex flex-col"
              >
                <Link href={`/${locale}/products/${product.slug}`} className="block">
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
                </Link>

                {/* <div className="mt-auto pt-4">
                  <AddToCartButton
                    product={{
                      productId: product.id,
                      name: product.name,
                      price: displayPrice,
                      image: firstImage,
                    }}
                  />
                </div> */}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
