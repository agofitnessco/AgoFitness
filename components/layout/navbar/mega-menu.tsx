"use client";

import { MEGA_MENU, MegaMenuHero } from "lib/constants";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

function HeroCard({
  hero,
  compact,
}: {
  hero: MegaMenuHero;
  compact?: boolean;
}) {
  return (
    <Link
      href={hero.path}
      prefetch={true}
      data-mega-col
      className={clsx(
        "group relative flex w-full flex-col justify-end overflow-hidden rounded-lg bg-neutral-100",
        compact ? "aspect-[4/5]" : "aspect-[16/9]",
      )}
    >
      {hero.image ? (
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          sizes="(min-width: 1024px) 30vw, 90vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#b48b8c]/25 via-neutral-100 to-neutral-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
      <div className="relative z-10 p-6">
        <p className="text-2xl font-bold tracking-tight text-white">
          {hero.title}
        </p>
        <p className="mt-1.5 text-sm text-white/80">{hero.subtitle}</p>
        <span className="mt-4 inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-transform group-hover:-translate-y-0.5">
          {hero.ctaLabel}
        </span>
      </div>
    </Link>
  );
}

export default function MegaMenu({
  activeCategory,
  transparent = false,
}: {
  activeCategory: string | null;
  transparent?: boolean;
}) {
  const entry = activeCategory ? MEGA_MENU[activeCategory] : undefined;
  if (!entry) return null;

  const isSplit = entry.heroes.length === 2;

  return (
    <div className="mx-auto grid max-w-screen-2xl grid-cols-[1.1fr_1fr] gap-16 px-4 py-10 lg:px-8">
      <div className={clsx("grid gap-4", isSplit && "grid-cols-2")}>
        {entry.heroes.map((hero) => (
          <HeroCard key={hero.title} hero={hero} compact={isSplit} />
        ))}
      </div>

      <div data-mega-col className="flex flex-col justify-center">
        <ul className="flex flex-col gap-1">
          {entry.primaryLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.path}
                prefetch={true}
                className={clsx(
                  "inline-block py-1 text-2xl font-bold tracking-tight transition-opacity hover:opacity-60",
                  transparent ? "text-white" : "text-black",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className={clsx(
            "mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6",
            transparent ? "border-white/20" : "border-neutral-200",
          )}
        >
          {entry.secondaryLinks.map((link) => (
            <Link
              key={link.label}
              href={link.path}
              prefetch={true}
              className={clsx(
                "text-sm transition-colors",
                transparent
                  ? "text-white/70 hover:text-white"
                  : "text-neutral-500 hover:text-black",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
