"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useFavorites } from "lib/use-favorites";
import Link from "next/link";

export default function NavFavorites({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  const favorites = useFavorites();

  return (
    <Link
      href="/favoritos"
      prefetch={true}
      aria-label="Favoritos"
      className={clsx(
        "relative flex h-11 w-11 items-center justify-center transition-colors",
        transparent ? "text-white" : "text-black",
      )}
    >
      <HeartIcon className="h-6 w-6 transition-all ease-in-out hover:scale-110" strokeWidth={2} />
      {favorites.length > 0 ? (
        <div
          className={clsx(
            "absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium",
            transparent ? "bg-white text-black" : "bg-black text-white",
          )}
        >
          {favorites.length}
        </div>
      ) : null}
    </Link>
  );
}
