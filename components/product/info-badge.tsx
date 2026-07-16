"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { ReactNode } from "react";

export function InfoBadge({ children }: { children: ReactNode }) {
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
        <div className="absolute top-6 left-0 z-20 w-72 max-w-[80vw] rounded-lg bg-black p-5 text-left text-sm leading-relaxed normal-case text-white shadow-xl">
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
