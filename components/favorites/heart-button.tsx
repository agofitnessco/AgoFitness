"use client";

import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { FavoriteItem, toggleFavorite } from "lib/favorites";
import { useIsFavorite } from "lib/use-favorites";

export default function HeartButton({
  item,
  className,
}: {
  item: FavoriteItem;
  className?: string;
}) {
  const isFavorite = useIsFavorite(item.handle);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(item);
      }}
      aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      aria-pressed={isFavorite}
      className={clsx(
        "absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110",
        className,
      )}
    >
      {isFavorite ? (
        <HeartSolidIcon className="h-5 w-5 text-[#b48b8c]" />
      ) : (
        <HeartOutlineIcon className="h-5 w-5 text-black" strokeWidth={2.2} />
      )}
    </button>
  );
}
