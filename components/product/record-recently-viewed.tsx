"use client";

import { firstColorHex, firstProductImage } from "lib/color-placeholder";
import { recordRecentlyViewed } from "lib/recently-viewed";
import type { Product } from "lib/shopify/types";
import { useEffect } from "react";

/**
 * Sin UI — registra la vista del producto en `localStorage` al montar la
 * página (mismo mecanismo 100% client-side que favoritos, sin cuentas de
 * cliente ni backend). Alimenta la sección "Vistos recientemente" del panel
 * de búsqueda del navbar (`nav-main.tsx`).
 */
export default function RecordRecentlyViewed({ product }: { product: Product }) {
  useEffect(() => {
    recordRecentlyViewed({
      handle: product.handle,
      title: product.title,
      price: product.priceRange.minVariantPrice.amount,
      currencyCode: product.priceRange.minVariantPrice.currencyCode,
      colorHex: firstColorHex(product),
      image: firstProductImage(product)?.url,
    });
  }, [product]);

  return null;
}
