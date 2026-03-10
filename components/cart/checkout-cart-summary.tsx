"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { APP_CONFIG } from "@/lib/config";

type CheckoutCartSummaryLabels = {
  cartTitle: string;
  emptyCart: string;
  subtotal: string;
  clearCart: string;
  remove: string;
};

type CheckoutCartSummaryProps = {
  labels: CheckoutCartSummaryLabels;
};

export function CheckoutCartSummary({ labels }: CheckoutCartSummaryProps) {
  const { items, subtotal, rawActions } = useCart();

  return (
    <section className="rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">{labels.cartTitle}</h2>
        {items.length > 0 ? (
          <Button type="button" variant="outline" size="sm" onClick={rawActions.clearCart}>
            {labels.clearCart}
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{labels.emptyCart}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {APP_CONFIG.currency.symbol}{item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  onClick={() => rawActions.updateQuantity(item.productId, item.quantity - 1)}
                  aria-label={`Decrease ${item.name} quantity`}
                  disabled={item.quantity <= APP_CONFIG.cart.minQuantity}
                >
                  −
                </Button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  onClick={() => rawActions.updateQuantity(item.productId, item.quantity + 1)}
                  aria-label={`Increase ${item.name} quantity`}
                  disabled={item.quantity >= APP_CONFIG.cart.maxQuantity}
                >
                  +
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => rawActions.removeItem(item.productId)}
                >
                  {labels.remove}
                </Button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t pt-3 text-sm font-medium">
            <span>{labels.subtotal}</span>
            <span>{APP_CONFIG.currency.symbol}{subtotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </section>
  );
}
