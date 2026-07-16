"use client";

import { Dialog, Transition } from "@headlessui/react";
import ProductCard from "components/collection/product-card";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { POPULAR_SEARCH_TERMS } from "lib/constants";
import { useSearchSuggest } from "lib/use-search-suggest";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

/** Mismas proporciones que `GridSkeletonCard` en `nav-main.tsx` — placeholder
 * mientras carga la primera respuesta de `/api/search-suggest`. */
function SkeletonCard() {
  return (
    <li className="animate-pulse">
      <div className="aspect-[3/4] w-full rounded-lg bg-neutral-200" />
      <div className="mt-3 h-2.5 w-2/3 rounded-full bg-neutral-200" />
      <div className="mt-2 h-2.5 w-1/3 rounded-full bg-neutral-100" />
    </li>
  );
}

/**
 * Panel de búsqueda a pantalla completa en mobile — estilo On Running:
 * input arriba, "Búsquedas sugeridas" (pills), "Productos" (grid 2 col con
 * resultados reales, más vendidos por default). Se abre/cierra desde el
 * ícono de lupa de `MobileNavBar`; el cierre real ("X") vive en la barra
 * inferior, no en este panel — mismo patrón que el buscador de On, donde el
 * ícono de menú se convierte en el botón de cerrar universal.
 */
export default function MobileSearchPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { products, isLoading } = useSearchSuggest(query, isOpen);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }
    const id = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(id);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const goToTerm = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50 md:hidden">
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition-transform ease-out duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition-transform ease-in duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <Dialog.Panel
            className="fixed inset-x-0 top-0 flex flex-col overflow-hidden bg-white"
            style={{
              bottom: "calc(4.5rem + env(safe-area-inset-bottom))",
              paddingTop: "env(safe-area-inset-top)",
            }}
          >
            <div className="flex-none px-4 pt-4">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-3">
                  <MagnifyingGlassIcon className="h-5 w-5 flex-none text-neutral-500" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Búsqueda de productos"
                    autoComplete="off"
                    className="w-full bg-transparent text-base text-black placeholder:text-neutral-500 focus:outline-none"
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                </div>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <div className="pt-6">
                <p className="text-sm font-semibold text-neutral-900">
                  Búsquedas sugeridas
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {POPULAR_SEARCH_TERMS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => goToTerm(term)}
                      className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-800 transition-colors active:border-black active:bg-black active:text-white"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <p className="mb-4 text-sm font-semibold text-neutral-900">
                  Productos
                </p>
                <ul
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("a")) onClose();
                  }}
                  className={clsx(
                    "grid grid-cols-2 gap-x-4 gap-y-8",
                    isLoading && products.length === 0 && "opacity-60",
                  )}
                >
                  {products.length > 0
                    ? products.map((product) => (
                        <ProductCard key={product.handle} product={product} />
                      ))
                    : isLoading
                      ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
                      : query.trim() && (
                          <p className="col-span-2 text-sm text-neutral-500">
                            No hay productos que coincidan con{" "}
                            <span className="font-semibold">
                              &quot;{query.trim()}&quot;
                            </span>
                          </p>
                        )}
                </ul>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
