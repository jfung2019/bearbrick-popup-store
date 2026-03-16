import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const points = [
  "All information is prototype content and subject to revision.",
  "Orders are processed after successful payment confirmation.",
  "Product availability is not guaranteed until checkout completion.",
  "User data handling follows platform privacy and legal requirements.",
  "Refund and exchange policy depends on product category and condition.",
];

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-14">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">T&C</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Terms & Conditions Prototype</h1>
      </div>

      <section className="rounded-xl border bg-card p-6">
        <ol className="list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ol>
      </section>

      <Link href={`/${locale}`} className="inline-flex h-10 items-center rounded-md border px-4 text-sm w-fit">Back Home</Link>
    </main>
  );
}
