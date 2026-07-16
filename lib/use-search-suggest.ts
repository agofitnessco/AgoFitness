"use client";

import { useEffect, useState } from "react";
import { Product } from "lib/shopify/types";

/**
 * Fetch compartido por el panel de búsqueda desktop (`nav-main.tsx`) y el
 * panel de búsqueda móvil (`mobile-search-panel.tsx`) — mismo endpoint
 * (`/api/search-suggest`), mismo debounce (300ms con texto, inmediato sin
 * texto para mostrar los más vendidos al abrir). `active` evita el fetch
 * mientras el panel está cerrado.
 */
export function useSearchSuggest(query: string, active: boolean) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!active) return;

    const controller = new AbortController();
    setIsLoading(true);
    const timeout = setTimeout(
      () => {
        fetch(`/api/search-suggest?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        })
          .then((res) => res.json())
          .then((data) => setProducts(data.products ?? []))
          .catch((err) => {
            if (err?.name !== "AbortError") setProducts([]);
          })
          .finally(() => setIsLoading(false));
      },
      query.trim() ? 300 : 0,
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [active, query]);

  return { products, isLoading };
}
