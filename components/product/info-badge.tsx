"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import type { ReactNode } from "react";

export function InfoBadge({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Más información"
        aria-expanded={open}
        className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 transition-colors hover:bg-neutral-200"
      >
        i
      </button>
      {open ? (
        <div
          className={clsx(
            "absolute top-6 z-20 w-72 max-w-[85vw] rounded-lg bg-black p-5 text-left text-sm leading-relaxed normal-case text-white shadow-xl",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="absolute top-3 right-3 text-white/60 transition-colors hover:text-white"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
          <div className="pr-5">{children}</div>
        </div>
      ) : null}
    </span>
  );
}
