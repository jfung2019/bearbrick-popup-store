import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-14">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Contact</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Contact Form Prototype</h1>
        <p className="mt-2 text-muted-foreground">Send us your question. Frontend-only prototype for now.</p>
      </div>

      <form className="rounded-xl border bg-card p-6 space-y-4">
        <input type="text" placeholder="Name" className="h-11 w-full rounded-md border bg-background px-3 text-sm" />
        <input type="email" placeholder="Email" className="h-11 w-full rounded-md border bg-background px-3 text-sm" />
        <input type="text" placeholder="Subject" className="h-11 w-full rounded-md border bg-background px-3 text-sm" />
        <textarea placeholder="Message" rows={6} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        <button type="button" className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">
          Submit
        </button>
      </form>

      <Link href={`/${locale}`} className="inline-flex h-10 items-center rounded-md border px-4 text-sm w-fit">Back Home</Link>
    </main>
  );
}
