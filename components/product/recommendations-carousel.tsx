"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ProductCard from "components/collection/product-card";
import { Product } from "lib/shopify/types";
import { useRef } from "react";

export function RecommendationsCarousel({
  title = "Creemos que también te gustará...",
  products,
}: {
  title?: string;
  products: Product[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  if (!products.length) return null;

  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: dir === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-16 w-full border-t border-neutral-200 pt-12 lg:mt-24">
      {/* Mismo breakout grid que components/product-showcase.tsx (home):
          título y carrusel arrancan en col-start-2, el track se sale hasta
          el borde real de la pantalla (col-end-4) al hacer scroll. */}
      <div className="grid grid-cols-[minmax(1rem,1fr)_min(1536px,calc(100%_-_2rem))_minmax(1rem,1fr)] lg:grid-cols-[minmax(2rem,1fr)_min(1536px,calc(100%_-_4rem))_minmax(2rem,1fr)]">
        <div className="col-start-2 row-start-1 mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-black lg:text-3xl">
            {title}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition-colors hover:bg-neutral-100"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition-colors hover:bg-neutral-100"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          className="col-start-2 col-end-4 row-start-2 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pr-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:pr-8 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <ProductCard
              key={product.handle}
              product={product}
              className="w-[75%] flex-none snap-start sm:w-[45%] lg:w-[23%]"
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
