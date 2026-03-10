"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

type AddToCartButtonProps = {
  product: {
    productId: number;
    name: string;
    price: number;
    image?: string;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const t = useTranslations("Products");
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const result = addItem(product, 1);
    // You can add toast notification here in the future
    if (result.success) {
      console.log(result.message);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleAddToCart}
      className="w-full"
      size="lg"
    >
      {t("addToCart")}
    </Button>
  );
}
