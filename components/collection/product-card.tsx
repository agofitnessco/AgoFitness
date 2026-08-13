"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { addItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import HeartButton from "components/favorites/heart-button";
import clsx from "clsx";
import { colorHex, modelGradient, productGradient } from "lib/color-placeholder";
import { Image as ShopifyImage, Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

const NEUTRAL_HEX = "#c9c9c4";

type ColorGroup = {
  name: string;
  hex: string;
  variantsBySize: Record<string, string>;
  /** foto real de producto para este color (si el catálogo ya la tiene) */
  image?: ShopifyImage;
  /** foto real con modelo para este color (no todos los colores la tienen) */
  modelImage?: ShopifyImage;
};

/**
 * Agrupa las variantes reales del producto por opción "Color" (si existe) y
 * junta las tallas disponibles por color. Productos sin opción de color
 * (ej. los conjuntos Kisu, una sola combinación por título) caen en un solo
 * grupo neutro — sin swatches, solo tallas.
 *
 * Fotos reales: como Shopify no tiene una asociación formal imagen-variante
 * para este catálogo, se hace matching por `altText` (ej. "Top Diamond
 * Cross Cielo" / "Top Diamond Cross Cielo modelo" — ver
 * docs/tienda.md y cómo se subieron en el Admin). Si no hay match, cae al
 * gradiente placeholder (línea Element, sin fotografía real todavía).
 */
function groupByColor(product: Product): ColorGroup[] {
  const hasColorOption = product.options.some(
    (o) => o.name.toLowerCase() === "color",
  );

  const groups = new Map<string, ColorGroup>();

  for (const variant of product.variants) {
    const colorValue = hasColorOption
      ? variant.selectedOptions.find((o) => o.name.toLowerCase() === "color")
          ?.value
      : undefined;
    const sizeValue = variant.selectedOptions.find(
      (o) => o.name.toLowerCase() === "talla",
    )?.value;

    const name = colorValue ?? "Único";
    if (!groups.has(name)) {
      const colorImages = colorValue
        ? product.images.filter((img) =>
            img.altText?.toLowerCase().includes(colorValue.toLowerCase()),
          )
        : [];
      groups.set(name, {
        name,
        hex: colorValue ? colorHex(colorValue) : NEUTRAL_HEX,
        variantsBySize: {},
        image: colorImages.find(
          (img) => !img.altText?.toLowerCase().includes("modelo"),
        ),
        modelImage: colorImages.find((img) =>
          img.altText?.toLowerCase().includes("modelo"),
        ),
      });
    }
    if (sizeValue) {
      groups.get(name)!.variantsBySize[sizeValue] = variant.id;
    }
  }

  return Array.from(groups.values());
}

export default function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const colors = groupByColor(product);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addCartItem } = useCart();
  const activeColor = colors[activeColorIndex]!;
  const sizes = Object.keys(activeColor.variantsBySize);
  const price = product.priceRange.minVariantPrice;

  const handleAddToCart = (size: string) => {
    const variantId = activeColor.variantsBySize[size];
    if (!variantId) return;

    startTransition(async () => {
      addCartItem(
        {
          id: variantId,
          title:
            activeColor.name === "Único"
              ? size
              : `${size} / ${activeColor.name}`,
          availableForSale: true,
          selectedOptions: [
            { name: "Talla", value: size },
            { name: "Color", value: activeColor.name },
          ],
          price,
        },
        {
          id: product.id,
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
    setTimeout(
      () => setAddedSize((current) => (current === size ? null : current)),
      1200,
    );
  };

  const favoriteItem = {
    handle: product.handle,
    title: product.title,
    price: price.amount,
    currencyCode: price.currencyCode,
    colorHex: activeColor.hex,
  };

  return (
    <li className={clsx("group", className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-100">
        <Link
          href={`/product/${product.handle}`}
          prefetch={true}
          className="absolute inset-0"
        >
          {activeColor.image ? (
            <>
              {/* foto real de producto */}
              <Image
                key={`${activeColor.name}-flat`}
                src={activeColor.image.url}
                alt={activeColor.image.altText || product.title}
                fill
                sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 75vw"
                className={clsx(
                  "object-cover transition-opacity duration-500 ease-out",
                  activeColor.modelImage && "group-hover:opacity-0",
                )}
              />
              {/* foto real con modelo (si este color la tiene) */}
              {activeColor.modelImage ? (
                <Image
                  key={`${activeColor.name}-model`}
                  src={activeColor.modelImage.url}
                  alt={activeColor.modelImage.altText || product.title}
                  fill
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 75vw"
                  className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
              ) : null}
            </>
          ) : (
            <>
              {/* sin fotografía real todavía — placeholder de gradiente por color */}
              <div
                className="absolute inset-0 transition-opacity duration-500 ease-out group-hover:opacity-0"
                style={{ backgroundImage: productGradient(activeColor.hex) }}
              />
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                style={{ backgroundImage: modelGradient(activeColor.hex) }}
              />
            </>
          )}
        </Link>

        <HeartButton item={favoriteItem} />

        {sizes.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 px-4 py-3 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:translate-y-0">
            <p className="mb-2 text-[10px] font-bold tracking-[0.15em] text-white/70 uppercase">
              Añadir rápido
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
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
                  {addedSize === size ? (
                    <CheckIcon className="h-3.5 w-3.5" />
                  ) : (
                    size
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {colors.length > 1 && (
        <div className="mt-3 flex items-center gap-1.5">
          {colors.map((color, i) => (
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
      )}
      <p
        className={clsx(
          "text-sm font-semibold",
          colors.length > 1 ? "mt-2" : "mt-3",
        )}
      >
        {product.title}
      </p>
      <p className="text-sm text-neutral-500">
        {activeColor.name !== "Único" && `${activeColor.name} · `}MX$
        {Number(price.amount).toLocaleString("es-MX")}
      </p>
    </li>
  );
}
