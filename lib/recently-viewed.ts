export type RecentlyViewedItem = {
  handle: string;
  title: string;
  price: string;
  currencyCode: string;
  colorHex: string;
};

const STORAGE_KEY = "ago:recently-viewed";
const CHANGE_EVENT = "ago:recently-viewed-changed";
const MAX_ITEMS = 6;

/**
 * Mismo patrón que `lib/favorites.ts`: cache en memoria para que
 * `useSyncExternalStore` reciba siempre la misma referencia mientras no hay
 * cambios reales (si no, React ve "un valor nuevo" en cada render y entra
 * en loop infinito).
 */
let cache: RecentlyViewedItem[] | null = null;

function readFromStorage(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function ensureCache(): RecentlyViewedItem[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

function write(items: RecentlyViewedItem[]) {
  cache = items;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  return ensureCache();
}

/**
 * Registra una vista: la mueve al frente si ya estaba (para que "más
 * reciente" sea real) y recorta a `MAX_ITEMS`. Se llama una vez por mount
 * de la página de producto — ver `components/product/record-recently-viewed.tsx`.
 */
export function recordRecentlyViewed(item: RecentlyViewedItem) {
  const items = ensureCache();
  const withoutItem = items.filter((i) => i.handle !== item.handle);
  write([item, ...withoutItem].slice(0, MAX_ITEMS));
}

export function subscribeRecentlyViewed(onChange: () => void) {
  const onStorage = () => {
    cache = readFromStorage();
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
