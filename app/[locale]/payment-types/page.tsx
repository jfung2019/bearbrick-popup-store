import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const methods = ["Visa", "Mastercard", "Apple Pay", "Google Pay", "WeChat Pay", "Alipay", "FPS", "Bank Transfer"];

export default async function PaymentTypesPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-14">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Payment Types</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Payment Methods Prototype</h1>
        <p className="mt-2 text-muted-foreground">Frontend-only listing of supported payment options.</p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {methods.map((method) => (
          <div key={method} className="rounded-xl border bg-card p-4 text-center text-sm font-medium">
            {method}
          </div>
        ))}
      </section>

      <Link href={`/${locale}`} className="inline-flex h-10 items-center rounded-md border px-4 text-sm w-fit">Back Home</Link>
    </main>
  );
}
