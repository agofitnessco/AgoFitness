"use client";

import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { FavoriteItem, toggleFavorite } from "lib/favorites";
import { useIsFavorite } from "lib/use-favorites";

export default function HeartButton({
  item,
  className,
  variant = "overlay",
}: {
  item: FavoriteItem;
  className?: string;
  /** "overlay" (default) = flotante sobre una imagen de tarjeta. "inline" = botón normal en el flujo (ej. junto al título en la página de producto). */
  variant?: "overlay" | "inline";
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
        "z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full transition-transform hover:scale-110",
        variant === "overlay"
          ? "absolute top-3 right-3 bg-white/90 shadow-sm backdrop-blur-sm"
          : "bg-neutral-100",
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
