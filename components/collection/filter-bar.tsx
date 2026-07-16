"use client";

import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { sorting } from "lib/constants";
import { typeLabel } from "lib/product-types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";

export type TypeFacet = { value: string; label: string; count: number };

export default function FilterBar({
  types,
  resultCount,
  children,
}: {
  types: TypeFacet[];
  resultCount: number;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSortSlug = searchParams.get("sort");
  const activeSort = sorting.find((s) => s.slug === activeSortSlug) ?? sorting[0]!;
  const activeTypes = (searchParams.get("tipo") ?? "").split(",").filter(Boolean);
  const activeFilterCount = activeTypes.length + (activeSortSlug ? 1 : 0);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const setSort = (slug: string | null) =>
    pushParams((params) => {
      if (slug) params.set("sort", slug);
      else params.delete("sort");
    });

  const toggleType = (value: string) =>
    pushParams((params) => {
      const next = activeTypes.includes(value)
        ? activeTypes.filter((t) => t !== value)
        : [...activeTypes, value];
      if (next.length) params.set("tipo", next.join(","));
      else params.delete("tipo");
    });

  const clearAll = () =>
    pushParams((params) => {
      params.delete("tipo");
      params.delete("sort");
    });

  return (
    <div>
      <div className="sticky top-0 z-20 mb-8 flex items-center justify-between bg-white py-3 md:top-[116px]">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:border-black"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4" />
          {isOpen ? "Ocultar filtros" : "Mostrar filtros"}
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>
        <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">
          {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
        </p>
      </div>

      <div
        className={isOpen ? "grid grid-cols-1 gap-10 sm:grid-cols-[220px_1fr]" : ""}
      >
        {isOpen && (
          <div className="sticky top-[68px] flex max-h-[calc(100svh-192px)] flex-col gap-8 self-start overflow-y-auto border-t border-neutral-200 pt-6 sm:border-t-0 sm:pt-0 md:top-[184px]">
            {activeFilterCount > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-bold text-black">
                  Filtros aplicados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeSortSlug && (
                    <button
                      type="button"
                      onClick={() => setSort(null)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-sm hover:border-black"
                    >
                      {activeSort.title}
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {activeTypes.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleType(value)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-sm hover:border-black"
                    >
                      {typeLabel(value)}
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-3 text-xs font-bold tracking-wide text-neutral-500 uppercase hover:text-black"
                >
                  Borrar todos
                </button>
              </div>
            )}

            <div>
              <h3 className="mb-3 text-sm font-bold text-black">Ordenar por</h3>
              <div className="flex flex-col gap-2.5">
                {sorting.map((option) => (
                  <label
                    key={option.title}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700"
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={activeSort.title === option.title}
                      onChange={() => setSort(option.slug)}
                      className="h-4 w-4 accent-black"
                    />
                    {option.title}
                  </label>
                ))}
              </div>
            </div>

            {types.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-bold text-black">
                  Tipo de producto
                </h3>
                <div className="flex flex-col gap-2.5">
                  {types.map((type) => (
                    <label
                      key={type.value}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700"
                    >
                      <input
                        type="checkbox"
                        checked={activeTypes.includes(type.value)}
                        onChange={() => toggleType(type.value)}
                        className="h-4 w-4 rounded-sm accent-black"
                      />
                      {type.label}
                      <span className="text-neutral-400">({type.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <ul
          className={clsx(
            "grid grid-cols-2 gap-x-5 gap-y-10",
            isOpen ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
        >
          {children}
        </ul>
      </div>
    </div>
  );
}
