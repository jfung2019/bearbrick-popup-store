import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const items = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `Placeholder Item ${index + 1}`,
  price: `HK$${(index + 1) * 100}`,
}));

export default async function MerchandisePage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-14">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Merchandise</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Merchandise Prototype</h1>
        <p className="mt-2 text-muted-foreground">Placeholder catalog grid for client review.</p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border bg-card p-4">
            <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-muted text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Product Image
            </div>
            <h2 className="text-base font-medium">{item.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.price}</p>
            <button type="button" className="mt-4 inline-flex h-9 items-center rounded-md border px-3 text-sm">
              Add to Cart
            </button>
          </article>
        ))}
      </section>

      <Link href={`/${locale}`} className="inline-flex h-10 items-center rounded-md border px-4 text-sm w-fit">
        Back Home
      </Link>
    </main>
  );
}
