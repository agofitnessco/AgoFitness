export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  }, // asc
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "Price: High to low",
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

export const CATEGORY_LINKS = [
  { title: "Mujer", path: "/search/mujer" },
  { title: "Hombre", path: "/search/hombre" },
  { title: "Niños", path: "/search/ninos" },
];

export const POPULAR_SEARCH_TERMS = [
  "leggings",
  "sports bra",
  "running",
  "yoga",
  "hoodie",
  "shorts",
  "sneakers",
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
      { label: "Leggings", path: "/search/mujer?tag=leggings" },
      { label: "Sports bras", path: "/search/mujer?tag=sports-bra" },
      { label: "Tops", path: "/search/mujer?tag=tops" },
      { label: "Shorts", path: "/search/mujer?tag=shorts" },
      { label: "Hoodies", path: "/search/mujer?tag=hoodies" },
      { label: "Ver todo", path: "/search/mujer" },
    ],
    secondaryLinks: [
      { label: "Yoga", path: "/search/mujer?tag=yoga" },
      { label: "Running", path: "/search/mujer?tag=running" },
      { label: "Guía de tallas", path: "/soporte" },
      { label: "Centro de ayuda", path: "/soporte" },
    ],
    heroes: [
      {
        title: "Studio Collection",
        subtitle: "Menos fricción. Más movimiento.",
        ctaLabel: "Ver ahora",
        path: "/search/mujer?tag=yoga",
      },
      {
        title: "Running",
        subtitle: "Hecho para el pavimento.",
        ctaLabel: "Ver ahora",
        path: "/search/mujer?tag=running",
      },
    ],
  },
  Hombre: {
    primaryLinks: [
      { label: "Playeras", path: "/search/hombre?tag=playeras" },
      { label: "Shorts", path: "/search/hombre?tag=shorts" },
      { label: "Joggers", path: "/search/hombre?tag=joggers" },
      { label: "Hoodies", path: "/search/hombre?tag=hoodies" },
      { label: "Tank tops", path: "/search/hombre?tag=tank-tops" },
      { label: "Ver todo", path: "/search/hombre" },
    ],
    secondaryLinks: [
      { label: "Running", path: "/search/hombre?tag=running" },
      { label: "Training", path: "/search/hombre?tag=training" },
      { label: "Guía de tallas", path: "/soporte" },
      { label: "Centro de ayuda", path: "/soporte" },
    ],
    heroes: [
      {
        title: "Performance Line",
        subtitle: "Menos peso. Máximo rendimiento.",
        ctaLabel: "Ver ahora",
        path: "/search/hombre?tag=training",
      },
      {
        title: "Training",
        subtitle: "Construido para el esfuerzo.",
        ctaLabel: "Ver ahora",
        path: "/search/hombre?tag=training",
      },
    ],
  },
  "Niños": {
    primaryLinks: [
      { label: "Playeras", path: "/search/ninos?tag=playeras" },
      { label: "Shorts", path: "/search/ninos?tag=shorts" },
      { label: "Sudaderas", path: "/search/ninos?tag=sudaderas" },
      { label: "Fútbol", path: "/search/ninos?tag=futbol" },
      { label: "Ver todo", path: "/search/ninos" },
    ],
    secondaryLinks: [
      { label: "Escuela deportiva", path: "/search/ninos?tag=escuela" },
      { label: "Mochilas", path: "/search/ninos?tag=mochilas" },
      { label: "Guía de tallas", path: "/soporte" },
      { label: "Centro de ayuda", path: "/soporte" },
    ],
    heroes: [
      {
        title: "Back to Sport",
        subtitle: "Listos para la temporada.",
        ctaLabel: "Ver ahora",
        path: "/search/ninos",
      },
    ],
  },
};
