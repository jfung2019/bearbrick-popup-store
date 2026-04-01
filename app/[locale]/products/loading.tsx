export default function ProductLoading() {
  return (
    <main className="flex min-h-screen w-full flex-row gap-8 px-6 py-12 animate-pulse">
      {/* Filter Sidebar Skeleton */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-lg border p-6 shadow-sm bg-zinc-900">
          <div className="h-6 w-1/2 bg-zinc-700 rounded mb-6" />
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-1/3 bg-zinc-800 rounded mb-2" />
                <div className="h-8 w-full bg-zinc-800 rounded" />
              </div>
            ))}
            <div className="mt-2 h-8 w-1/2 bg-black rounded" />
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <div className="h-10 w-1/3 bg-zinc-700 rounded mb-2" />
          <div className="h-4 w-1/2 bg-zinc-800 rounded" />
        </div>
        <section className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <article key={i} className="rounded-lg border p-3 bg-zinc-900 flex flex-col">
              <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-zinc-800" />
              <div className="h-5 w-3/4 bg-zinc-700 rounded mb-2" />
              <div className="h-4 w-1/2 bg-zinc-800 rounded mb-4" />
              <div className="h-8 w-full bg-black rounded" />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
