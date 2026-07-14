"use client";

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { addItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import HeartButton from "components/favorites/heart-button";
import clsx from "clsx";
import { modelGradient, productGradient } from "lib/color-placeholder";
import {
  ELEMENT_PRODUCTS,
  type ShowcaseProduct,
} from "lib/product-showcase-data";
import { useRef, useState, useTransition } from "react";

/**
 * Placeholder de marca por producto — el color activo determina el gradiente
 * de las dos capas (producto solo / con modelo), calculado a partir del hex
 * real de cada variante (ver `lib/color-placeholder.ts`). Sustituir por
 * fotografía real (una foto por color) cuando esté disponible. Datos
 * (nombre, precio, colores, tallas) vienen de los productos reales ya
 * cargados en Shopify (línea Element) — ver `lib/product-showcase-data.ts`.
 */

function ProductCard({ product }: { product: ShowcaseProduct }) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addCartItem } = useCart();
  const activeColor = product.colors[activeColorIndex]!;

  const handleAddToCart = (size: string) => {
    const variantId = activeColor.variantsBySize[size];
    if (!variantId) return;

    startTransition(async () => {
      addCartItem(
        {
          id: variantId,
          title: `${size} / ${activeColor.name}`,
          availableForSale: true,
          selectedOptions: [
            { name: "Talla", value: size },
            { name: "Color", value: activeColor.name },
          ],
          price: { amount: product.price.toFixed(2), currencyCode: "MXN" },
        },
        {
          id: product.productId,
          handle: product.handle,
          title: product.title,
          featuredImage: {
            url: "/imgs/logo-ago.png",
            altText: product.title,
            width: 512,
            height: 512,
          },
        } as any,
      );
      await addItem(null, variantId);
    });

    setAddedSize(size);
    setTimeout(() => setAddedSize((current) => (current === size ? null : current)), 1200);
  };

  return (
    <li className="group w-[75%] flex-none snap-start sm:w-[45%] lg:w-[23%]">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
        {/* producto solo */}
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out group-hover:opacity-0"
          style={{ backgroundImage: productGradient(activeColor.hex) }}
        />
        {/* con modelo */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          style={{ backgroundImage: modelGradient(activeColor.hex) }}
        />

        <HeartButton
          item={{
            handle: product.handle,
            title: product.title,
            price: product.price.toFixed(2),
            currencyCode: "MXN",
            colorHex: activeColor.hex,
          }}
        />

        {/* añadir rápido */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 px-4 py-3 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:translate-y-0">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">
            Añadir rápido
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                disabled={isPending}
                onClick={() => handleAddToCart(size)}
                aria-label={`Añadir talla ${size} al carrito`}
                className={clsx(
                  "flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-xs font-semibold transition-colors disabled:cursor-wait",
                  addedSize === size
                    ? "border-white bg-white text-black"
                    : "border-white/30 text-white hover:border-white hover:bg-white hover:text-black",
                )}
              >
                {addedSize === size ? <CheckIcon className="h-3.5 w-3.5" /> : size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {product.colors.map((color, i) => (
          <button
            key={color.name}
            type="button"
            title={color.name}
            aria-label={color.name}
            aria-pressed={i === activeColorIndex}
            onClick={() => setActiveColorIndex(i)}
            className={clsx(
              "h-4 w-4 rounded-full border border-black/10 transition-shadow",
              i === activeColorIndex &&
                "ring-2 ring-black ring-offset-2 ring-offset-white",
            )}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
      <p className="mt-2 text-sm font-semibold">{product.title}</p>
      <p className="text-sm text-neutral-500">
        {activeColor.name} · MX${product.price.toLocaleString("es-MX")}
      </p>
    </li>
  );
}

export default function ProductShowcase({
  title = "Lo más nuevo",
  products = ELEMENT_PRODUCTS,
}: {
  title?: string;
  products?: ShowcaseProduct[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: dir === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
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
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </ul>
    </section>
  );
}
