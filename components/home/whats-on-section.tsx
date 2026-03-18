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
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              {kicker}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">{description}</p>
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
          >
            {viewAllLabel}
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl border border-white/10 bg-card/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-colors hover:bg-card"
            >
              <div className="relative mb-4 aspect-video overflow-hidden rounded-xl border border-white/8 bg-black/20">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {item.date}
                </p>
                <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {item.tag}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              <Link
                href={item.href}
                className="mt-5 inline-flex items-center text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                {item.ctaLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
