"use client";

import { useSyncExternalStore } from "react";
import { getRecentlyViewed, subscribeRecentlyViewed } from "lib/recently-viewed";

const EMPTY: ReturnType<typeof getRecentlyViewed> = [];

export function useRecentlyViewed() {
  return useSyncExternalStore(
    subscribeRecentlyViewed,
    getRecentlyViewed,
    () => EMPTY,
  );
}
