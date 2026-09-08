export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Destacados",
  slug: null,
  sortKey: "BEST_SELLING",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Novedades",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Precio: de menor a mayor",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  },
  {
    title: "Precio: de mayor a menor",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2023-01/graphql.json";
export const CUSTOMER_TOKEN_COOKIE = "customerToken";

/**
 * Países para el selector de direcciones (`app/cuenta`). Es solo el
 * nombre que se guarda en `MailingAddressInput.country` — Shopify no lo
 * valida contra las zonas de envío configuradas al guardar la dirección
 * (esa validación pasa después, en el checkout), así que no hace falta
 * limitarlo a "lo que ya envía la tienda" para que sea honesto. México va
 * primero por ser el mercado real de Ago Fitness.
 */
export const COUNTRIES = [
  "México",
  "Estados Unidos",
  "Canadá",
  "Argentina",
  "Chile",
  "Colombia",
  "Perú",
  "España",
  "Guatemala",
  "Costa Rica",
  "Panamá",
  "Ecuador",
  "Uruguay",
  "República Dominicana",
];

export const CATEGORY_LINKS = [
  { title: "Mujer", path: "/search/mujer" },
  { title: "Hombre", path: "/search/hombre" },
];

// En español y alineados a las colecciones reales del catálogo (ver
// lib/shopify) — la lista anterior tenía términos en inglés y categorías
// que Ago Fitness no vende (sports bra, running, yoga, hoodie, sneakers),
// prometiendo resultados que no existían.
export const POPULAR_SEARCH_TERMS = [
  "leggings",
  "playeras",
  "shorts",
  "chamarras",
  "conjuntos",
  "faldas",
  "tops",
];

/**
 * Shopify busca por texto libre sin stemming de plural→singular en
 * español — `query: "playeras"` no encuentra productos con
 * `product_type: "Playera"` aunque sea evidentemente la misma categoría
 * ("no hay resultados" al hacer clic en la pill). Se traduce cada término
 * de `POPULAR_SEARCH_TERMS` a una búsqueda estructurada por
 * `product_type` (match exacto, sin ambigüedad de idioma) antes de
 * mandarla a la Storefront API — el texto visible en el buscador/resultado
 * sigue siendo el término bonito en español, solo la query real cambia.
 * Usado en `app/search/page.tsx` y `app/api/search-suggest/route.ts`.
 */
const SEARCH_TERM_TO_QUERY: Record<string, string> = {
  leggings: "product_type:Legging",
  playeras: "product_type:Playera",
  shorts: "product_type:Short",
  chamarras: "product_type:Chamarra",
  conjuntos: "product_type:Conjunto",
  faldas: "product_type:Falda",
  tops: "product_type:Top",
};

export function resolveSearchQuery(raw?: string) {
  if (!raw) return raw;
  return SEARCH_TERM_TO_QUERY[raw.trim().toLowerCase()] ?? raw;
}

export type MegaMenuHero = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  path: string;
  /** Foto real opcional — sin esto la tarjeta cae al gradiente de marca. */
  image?: string;
};

export type MegaMenuEntry = {
  primaryLinks: { label: string; path: string }[];
  secondaryLinks: { label: string; path: string }[];
  heroes: MegaMenuHero[];
};

export const MEGA_MENU: Record<string, MegaMenuEntry> = {
  Mujer: {
    primaryLinks: [
      { label: "Tops", path: "/search/tops" },
      { label: "Playeras", path: "/search/playeras-mujer" },
      { label: "Leggings", path: "/search/leggings" },
      { label: "Conjuntos", path: "/search/conjuntos" },
      { label: "Faldas", path: "/search/faldas" },
      { label: "Shorts", path: "/search/shorts-mujer" },
      { label: "Chamarras", path: "/search/chamarras" },
      { label: "Ver todo", path: "/search/mujer" },
    ],
    secondaryLinks: [
      { label: "Guía de tallas", path: "/guia-de-tallas" },
      { label: "Centro de ayuda", path: "/soporte" },
    ],
    heroes: [
      {
        title: "Conjuntos",
        subtitle: "Sets completos, listos para moverte.",
        ctaLabel: "Ver ahora",
        path: "/search/conjuntos",
      },
      {
        title: "Leggings",
        subtitle: "Movimiento sin restricciones.",
        ctaLabel: "Ver ahora",
        path: "/search/leggings",
      },
    ],
  },
  Hombre: {
    primaryLinks: [
      { label: "Playeras", path: "/search/playeras" },
      { label: "Shorts", path: "/search/shorts-hombre" },
      { label: "Ver todo", path: "/search/hombre" },
    ],
    secondaryLinks: [
      { label: "Guía de tallas", path: "/guia-de-tallas" },
      { label: "Centro de ayuda", path: "/soporte" },
    ],
    heroes: [
      {
        title: "Playeras",
        subtitle: "Ligereza y rendimiento diario.",
        ctaLabel: "Ver ahora",
        path: "/search/playeras",
        image: "/imgs/mega-menu/hombre-playeras.jpg",
      },
      {
        title: "Shorts",
        subtitle: "Libertad de movimiento.",
        ctaLabel: "Ver ahora",
        path: "/search/shorts-hombre",
      },
    ],
  },
};
