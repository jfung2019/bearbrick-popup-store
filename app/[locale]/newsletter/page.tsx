import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NewsletterPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-14">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Newsletter</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Newsletter Subscription</h1>
        <p className="mt-2 text-muted-foreground">Subscribe to updates, drops, and event announcements.</p>
      </div>

      <section className="rounded-xl border bg-card p-6">
        <input type="email" placeholder="Email address" className="h-11 w-full rounded-md border bg-background px-3 text-sm" />
        <div className="mt-4 flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Product Updates</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Events</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Promotions</label>
        </div>
        <button type="button" className="mt-5 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">
          Subscribe
        </button>
      </section>

      <Link href={`/${locale}`} className="inline-flex h-10 items-center rounded-md border px-4 text-sm w-fit">Back Home</Link>
    </main>
  );
}
