import { useTranslations } from "next-intl";
import { CheckoutCartSummary } from "@/components/cart/checkout-cart-summary";
import { CheckoutPaymentSection } from "@/components/cart/checkout-payment-section";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>

      <CheckoutCartSummary
        labels={{
          cartTitle: t("cartTitle"),
          emptyCart: t("emptyCart"),
          subtotal: t("subtotal"),
          clearCart: t("clearCart"),
          remove: t("remove"),
        }}
      />

      <CheckoutPaymentSection
        labels={{
          paymentTitle: t("paymentTitle"),
          paymentBody: t("paymentBody"),
          shipping: t("shipping"),
          shippingPlaceholder: t("shippingPlaceholder"),
          subtotal: t("subtotal"),
          total: t("total"),
          paymentDisabled: t("paymentDisabled"),
          airwallexPlaceholder: t("airwallexPlaceholder"),
        }}
      />
    </main>
  );
}
