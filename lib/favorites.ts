export type FavoriteItem = {
  handle: string;
  title: string;
  price: string;
  currencyCode: string;
  colorHex: string;
};

const STORAGE_KEY = "ago:favorites";
const CHANGE_EVENT = "ago:favorites-changed";

/**
 * `useSyncExternalStore` exige que `getSnapshot` devuelva la MISMA referencia
 * mientras no haya cambios reales — si no, React ve "un valor nuevo" en cada
 * render y entra en loop infinito ("getSnapshot should be cached"). Por eso
 * se cachea el array en memoria en vez de volver a hacer `JSON.parse` en
 * cada llamada.
 */
let cache: FavoriteItem[] | null = null;

function readFromStorage(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function ensureCache(): FavoriteItem[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

function write(items: FavoriteItem[]) {
  cache = items;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getFavorites(): FavoriteItem[] {
  return ensureCache();
}

export function isFavorite(handle: string): boolean {
  return ensureCache().some((item) => item.handle === handle);
}

export function toggleFavorite(item: FavoriteItem) {
  const items = ensureCache();
  const exists = items.some((i) => i.handle === item.handle);
  write(
    exists
      ? items.filter((i) => i.handle !== item.handle)
      : [...items, item],
  );
}

export function subscribeFavorites(onChange: () => void) {
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
