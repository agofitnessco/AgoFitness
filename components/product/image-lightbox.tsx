"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

/**
 * Zoom de las fotos de producto — click en cualquier foto de la galería
 * (`gallery.tsx`) abre esta vista a pantalla completa. Mismo patrón de
 * `Dialog`/`Transition` de Headless UI que ya usa el carrito
 * (`cart/modal.tsx`), no una librería nueva. Navegación con flechas,
 * teclado (← →, Escape) y click afuera para cerrar.
 */
export function ImageLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: { src: string; altText: string }[];
  startIndex: number | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex ?? 0);
  const isOpen = startIndex !== null;

  // Abrir desde una foto distinta (ej. click en el thumbnail #3) debe
  // arrancar el lightbox justo ahí, no donde se haya quedado la vez pasada.
  useEffect(() => {
    if (startIndex !== null) setIndex(startIndex);
  }, [startIndex]);

  const goTo = (next: number) => {
    setIndex(((next % images.length) + images.length) % images.length);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index, images.length]);

  return (
    <Transition show={isOpen} as={Fragment} afterLeave={() => setIndex(0)}>
      <Dialog onClose={onClose} className="relative z-[70]">
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition-all ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition-all ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="fixed inset-0 flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6">
              <span className="text-sm font-medium tabular-nums text-white/80">
                {index + 1}/{images.length}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div
              className="relative flex-1 px-4 pb-6 sm:px-16 sm:pb-10"
              onClick={onClose}
            >
              <div
                className="relative mx-auto h-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                {images[index] ? (
                  <Image
                    key={images[index].src}
                    src={images[index].src}
                    alt={images[index].altText}
                    fill
                    sizes="(min-width: 640px) 80vw, 100vw"
                    className="object-contain"
                    priority
                  />
                ) : null}
              </div>

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(index - 1);
                    }}
                    aria-label="Foto anterior"
                    className={clsx(
                      "absolute top-1/2 left-3 -translate-y-1/2 sm:left-6",
                      "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20",
                    )}
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(index + 1);
                    }}
                    aria-label="Foto siguiente"
                    className={clsx(
                      "absolute top-1/2 right-3 -translate-y-1/2 sm:right-6",
                      "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20",
                    )}
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
