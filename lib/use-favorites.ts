"use client";

import { useSyncExternalStore } from "react";
import { getFavorites, subscribeFavorites } from "lib/favorites";

const EMPTY: ReturnType<typeof getFavorites> = [];

export function useFavorites() {
  return useSyncExternalStore(
    subscribeFavorites,
    getFavorites,
    () => EMPTY,
  );
}

export function useIsFavorite(handle: string) {
  const favorites = useFavorites();
  return favorites.some((item) => item.handle === handle);
}
