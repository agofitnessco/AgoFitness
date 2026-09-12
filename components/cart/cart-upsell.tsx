"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { addItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { firstColorHex, firstProductImage, productGradient } from "lib/color-placeholder";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { getCartUpsell } from "./actions";

/**
 * "También te puede gustar" dentro del carrito — mismas recomendaciones
 * reales de Shopify que "Ideas para combinar" en la página de producto,
 * pero con "agregar" de un clic (toma la primera talla disponible; si el
 * cliente quiere elegir talla, el título lleva al producto). Se recalcula
 * cada vez que cambia qué hay en el carrito (agregar el último producto
 * visto, no repetir lo que ya está adentro).
 */
function UpsellCard({ product }: { product: Product }) {
  const { addCartItem, closeCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const image = firstProductImage(product);
  const price = product.priceRange.minVariantPrice;
  const firstAvailable =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];

  const handleAdd = () => {
    if (!firstAvailable) return;
    startTransition(async () => {
      addCartItem(firstAvailable, product);
      await addItem(null, firstAvailable.id);
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/product/${product.handle}`}
        onClick={closeCart}
        className="relative h-14 w-14 flex-none overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
      >
        {image ? (
          <Image src={image.url} alt={product.title} fill className="object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: productGradient(firstColorHex(product)) }}
          />
        )}
      </Link>
      <Link
        href={`/product/${product.handle}`}
        onClick={closeCart}
        className="min-w-0 flex-1"
      >
        <p className="truncate text-sm font-medium">{product.title}</p>
        <p className="text-sm text-neutral-500">
          MX${Number(price.amount).toLocaleString("es-MX")}
        </p>
      </Link>
      <button
        type="button"
        onClick={handleAdd}
        disabled={isPending || !firstAvailable}
        aria-label={`Agregar ${product.title} al carrito`}
        className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-black text-white transition-transform active:scale-90 disabled:opacity-50"
      >
        {added ? (
          <span className="text-xs font-bold">✓</span>
        ) : (
          <PlusIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export function CartUpsell() {
  const { cart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  const lastLine = cart?.lines[cart.lines.length - 1];
  const lastProductId = lastLine?.merchandise.product.id;
  // El fragmento de producto que trae cada línea del carrito ya incluye
  // `tags` (mismo fragmento que usa el resto del sitio) — se manda al
  // servidor para que el upsell no mezcle género con lo último agregado.
  const lastProductTags = lastLine?.merchandise.product.tags ?? [];
  const cartHandles = cart?.lines
    .map((line) => line.merchandise.product.handle)
    .join(",");

  useEffect(() => {
    if (!lastProductId) {
      setProducts([]);
      return;
    }
    getCartUpsell(
      lastProductId,
      cartHandles?.split(",") ?? [],
      lastProductTags,
    ).then(setProducts);
    // cartHandles ya cubre cambios en el contenido del carrito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastProductId, cartHandles]);

  if (products.length === 0) return null;

  return (
    <div className="border-b border-neutral-200 py-4">
      <p className="mb-3 text-xs font-bold tracking-[0.14em] text-neutral-500 uppercase">
        También te puede gustar
      </p>
      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <UpsellCard key={product.handle} product={product} />
        ))}
      </div>
    </div>
  );
}
