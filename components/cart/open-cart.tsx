"use client";

import BagIcon from "components/icons/bag";
import clsx from "clsx";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function OpenCart({
  className,
  quantity,
  transparent,
}: {
  className?: string;
  quantity?: number;
  transparent?: boolean;
}) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const prevQuantityRef = useRef(quantity);

  // Bump sutil en el badge cuando la cantidad SUBE (agregar producto) — así
  // se confirma que la acción funcionó sin depender solo de que se abra el
  // drawer del carrito. No anima si baja (quitar producto) ni en el mount
  // inicial (evita el "pop" al cargar la página con un carrito ya lleno).
  useEffect(() => {
    const prev = prevQuantityRef.current;
    prevQuantityRef.current = quantity;
    if (prev === undefined || !quantity || quantity <= prev) return;

    const el = badgeRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 1.35, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 },
    );
  }, [quantity]);

  return (
    <div
      className={clsx(
        "relative flex h-11 w-11 items-center justify-center transition-colors",
        transparent ? "text-white" : "text-black",
      )}
    >
      <BagIcon
        className={clsx(
          "h-6 w-6 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />

      {quantity ? (
        <div
          ref={badgeRef}
          className={clsx(
            "absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium",
            transparent ? "bg-white text-black" : "bg-black text-white",
          )}
        >
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
