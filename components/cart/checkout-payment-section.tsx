"use client";

import { useCart } from "@/hooks/useCart";
import { APP_CONFIG } from "@/lib/config";

type CheckoutPaymentLabels = {
  paymentTitle: string;
  paymentBody: string;
  shipping: string;
  shippingPlaceholder: string;
  subtotal: string;
  total: string;
  paymentDisabled: string;
  airwallexPlaceholder: string;
};

type CheckoutPaymentSectionProps = {
  labels: CheckoutPaymentLabels;
};

export function CheckoutPaymentSection({ labels }: CheckoutPaymentSectionProps) {
  const { subtotal, isEmpty } = useCart();

  const shipping = APP_CONFIG.shipping.defaultCost;
  const total = subtotal + shipping;

  return (
    <section className="rounded-lg border p-4">
      <h2 className="text-lg font-medium">{labels.paymentTitle}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{labels.paymentBody}</p>

      <div className="mt-4 space-y-2 rounded-md border p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{labels.subtotal}</span>
          <span>{APP_CONFIG.currency.symbol}{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{labels.shipping}</span>
          <span>{labels.shippingPlaceholder}</span>
        </div>
        <div className="flex items-center justify-between border-t pt-2 font-medium">
          <span>{labels.total}</span>
          <span>{APP_CONFIG.currency.symbol}{total.toFixed(2)}</span>
        </div>
      </div>

      {isEmpty ? (
        <p className="mt-4 text-sm text-muted-foreground">{labels.paymentDisabled}</p>
      ) : null}

      <div
        className={`mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground ${
          isEmpty ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {labels.airwallexPlaceholder}
      </div>
    </section>
  );
}
