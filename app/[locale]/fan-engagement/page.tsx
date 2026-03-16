import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const activities = [
  "Collector of the Month",
  "Vote for Next Drop Theme",
  "Community Showcase",
  "Fan Story Submission",
];

export default async function FanEngagementPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-14">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Fan Engagement</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Fan Engagement Prototype</h1>
        <p className="mt-2 text-muted-foreground">Interactive community modules for participation.</p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {activities.map((activity) => (
          <article key={activity} className="rounded-xl border bg-card p-5">
            <h2 className="text-xl font-medium">{activity}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Placeholder interaction block for future backend integration.</p>
            <button type="button" className="mt-4 inline-flex h-9 items-center rounded-md border px-3 text-sm">Open</button>
          </article>
        ))}
      </section>

      <Link href={`/${locale}`} className="inline-flex h-10 items-center rounded-md border px-4 text-sm w-fit">Back Home</Link>
    </main>
  );
}
