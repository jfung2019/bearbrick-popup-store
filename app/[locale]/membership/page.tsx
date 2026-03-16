import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MembershipPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-14">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Membership</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Membership Signup Prototype</h1>
        <p className="mt-2 text-muted-foreground">Frontend-only flow for mobile/email signup + social sign-in.</p>
      </div>

      <section className="rounded-xl border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input type="text" placeholder="Mobile Number" className="h-11 rounded-md border bg-background px-3 text-sm" />
          <input type="email" placeholder="Email" className="h-11 rounded-md border bg-background px-3 text-sm" />
          <input type="password" placeholder="Password" className="h-11 rounded-md border bg-background px-3 text-sm" />
          <input type="password" placeholder="Confirm Password" className="h-11 rounded-md border bg-background px-3 text-sm" />
        </div>

        <button type="button" className="mt-4 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">
          Sign Up
        </button>

        <div className="mt-6 border-t pt-6">
          <p className="mb-3 text-sm text-muted-foreground">Or continue with</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="inline-flex h-10 items-center rounded-md border px-4 text-sm">Sign in with Google</button>
            <button type="button" className="inline-flex h-10 items-center rounded-md border px-4 text-sm">Sign in with WeChat</button>
            <Link href={`/${locale}/login`} className="inline-flex h-10 items-center rounded-md border px-4 text-sm">Regular Login</Link>
          </div>
        </div>
      </section>

      <Link href={`/${locale}`} className="inline-flex h-10 items-center rounded-md border px-4 text-sm w-fit">Back Home</Link>
    </main>
  );
}
