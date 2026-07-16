"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  colorHex,
  firstColorHex,
  modelGradient,
  productGradient,
} from "lib/color-placeholder";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function uniqueColorHexes(product: Product): string[] {
  const names = new Set<string>();
  for (const variant of product.variants) {
    const color = variant.selectedOptions.find(
      (o) => o.name.toLowerCase() === "color",
    )?.value;
    if (color) names.add(color);
  }
  return Array.from(names).map(colorHex);
}

function LookTile({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);
  const price = product.priceRange.minVariantPrice;
  const colors = uniqueColorHexes(product);

  return (
    <div
      className="group relative aspect-[3/4] overflow-hidden rounded-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: productGradient(firstColorHex(product)) }}
      />
      <Image
        src="/imgs/logo-ago.png"
        alt=""
        aria-hidden="true"
        fill
        className="object-contain p-8 opacity-20 mix-blend-overlay"
      />

      <span className="absolute top-3 left-3 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/10">
        <span className="h-1.5 w-1.5 rounded-full bg-black" />
      </span>

      {hover ? (
        <Link
          href={`/product/${product.handle}`}
          className="absolute top-10 left-3 z-20 w-48 rounded-lg bg-white p-4 shadow-xl"
        >
          <p className="truncate text-sm font-semibold text-black">
            {product.title}
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            MX${Number(price.amount).toLocaleString("es-MX")}
          </p>
          {colors.length > 1 ? (
            <div className="mt-2 flex gap-1">
              {colors.map((hex) => (
                <span
                  key={hex}
                  className="h-3 w-3 rounded-full border border-black/10"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          ) : null}
          <ArrowRightIcon className="absolute right-3 bottom-3 h-4 w-4 text-black" />
        </Link>
      ) : null}
    </div>
  );
}

export function OutfitGrid({
  heroProduct,
  pieces,
}: {
  heroProduct: Product;
  pieces: Product[];
}) {
  if (!pieces.length) return null;

  return (
    <div
      id="ideas-para-combinar"
      className="mt-16 scroll-mt-24 border-t border-neutral-200 pt-12 lg:mt-24"
    >
      <h2 className="mb-6 text-xl font-bold tracking-tight text-black">
        Ideas para combinar
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_2fr]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg lg:aspect-auto">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: modelGradient(firstColorHex(heroProduct)) }}
          />
          <Image
            src="/imgs/logo-ago.png"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain p-20 opacity-20 mix-blend-overlay"
          />
          <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase backdrop-blur-sm">
            Foto próximamente
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {pieces.slice(0, 6).map((product) => (
            <LookTile key={product.handle} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
