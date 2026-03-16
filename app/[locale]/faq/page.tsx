import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Prototype answer: standard shipping is 3-7 business days.",
  },
  {
    q: "Can I cancel an order?",
    a: "Prototype answer: cancellation is available before fulfilment.",
  },
  {
    q: "Do you ship internationally?",
    a: "Prototype answer: international shipping will be available for selected regions.",
  },
];

export default async function FAQPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-14">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">FAQ</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">FAQ Prototype</h1>
      </div>

      <section className="space-y-4">
        {faqs.map((faq) => (
          <article key={faq.q} className="rounded-xl border bg-card p-5">
            <h2 className="text-lg font-medium">{faq.q}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
          </article>
        ))}
      </section>

      <Link href={`/${locale}`} className="inline-flex h-10 items-center rounded-md border px-4 text-sm w-fit">Back Home</Link>
    </main>
  );
}
