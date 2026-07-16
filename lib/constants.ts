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
  { title: "Niños", path: "/search/ninos" },
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

export type MegaMenuHero = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  path: string;
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
      },
      {
        title: "Shorts",
        subtitle: "Libertad de movimiento.",
        ctaLabel: "Ver ahora",
        path: "/search/shorts-hombre",
      },
    ],
  },
  Niños: {
    // Sin productos/colección real todavía — pendiente (ver docs/navbar.md).
    primaryLinks: [{ label: "Ver todo", path: "/search/ninos" }],
    secondaryLinks: [
      { label: "Guía de tallas", path: "/guia-de-tallas" },
      { label: "Centro de ayuda", path: "/soporte" },
    ],
    heroes: [
      {
        title: "Próximamente",
        subtitle: "Nueva línea infantil en camino.",
        ctaLabel: "Ver ahora",
        path: "/search/ninos",
      },
    ],
  },
};
