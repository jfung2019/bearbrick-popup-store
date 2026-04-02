import Image from "next/image";
import Link from "next/link";

type WhatsOnItem = {
  id: string;
  date: string;
  tag: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  imageSrc: string;
};

type WhatsOnSectionProps = {
  kicker: string;
  title: string;
  description: string;
  viewAllLabel: string;
  viewAllHref: string;
  items: WhatsOnItem[];
};

export function WhatsOnSection({
  kicker,
  title,
  description,
  viewAllLabel,
  viewAllHref,
  items,
}: WhatsOnSectionProps) {
  return (
    <section id="whats-on" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="w-full px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-6">
          <div>
            <h2 className="font-serif text-4xl italic tracking-tight text-foreground sm:text-5xl">
              {title}
            </h2>
            <p className="mt-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              {description}
            </p>
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium tracking-wide text-amber-500 uppercase hover:text-amber-400 transition-colors"
          >
            {viewAllLabel}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Stacked horizontal cards */}
        <div className="mt-8 flex flex-col gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col sm:flex-row gap-5 rounded-2xl border border-white/10 bg-card/80 p-5 transition-colors hover:bg-card"
            >
              {/* Image */}
              <div className="relative aspect-video sm:aspect-square sm:w-52 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-black/20">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 208px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold tracking-wide text-amber-500 uppercase">
                    {item.tag}
                  </span>
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {item.date}
                  </span>
                </div>

                <h3 className="font-serif text-xl italic tracking-tight text-foreground sm:text-2xl">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase hover:text-foreground transition-colors"
                >
                  {item.ctaLabel}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
