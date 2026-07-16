"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { CATEGORY_LINKS, MEGA_MENU } from "lib/constants";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { Fragment, useState } from "react";

const UTILITY_LINKS = [
  { title: "Favoritos", path: "/favoritos" },
  { title: "Guía de tallas", path: "/guia-de-tallas" },
  { title: "Centro de ayuda", path: "/soporte" },
  { title: "Contacto", path: "/contacto" },
  { title: "Mi cuenta", path: "/cuenta" },
];

/**
 * Menú móvil a pantalla completa — estilo On Running: lista de categorías
 * en tipografía grande/bold arriba, lista de utilidad más chica/gris abajo.
 * A diferencia del drawer anterior (`mobile-menu.tsx`, retirado), cada
 * categoría con entrada en `MEGA_MENU` (Mujer/Hombre) se expande in-place
 * para revelar sus subcategorías reales — mismos datos que ya alimentan el
 * mega menu desktop, sin duplicar la taxonomía. Niños (sin catálogo/entrada
 * en MEGA_MENU) navega directo.
 */
export default function MobileMenuPanel({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

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
            className="fixed inset-x-0 top-0 flex flex-col overflow-y-auto bg-white"
            style={{
              bottom: "calc(4.1rem + env(safe-area-inset-bottom))",
              paddingTop: "env(safe-area-inset-top)",
            }}
          >
            <div className="flex-1 px-4 pb-10 pt-8">
              <ul>
                {CATEGORY_LINKS.map((item) => {
                  const megaEntry = MEGA_MENU[item.title];
                  const isExpanded = expanded === item.title;

                  if (!megaEntry) {
                    return (
                      <li
                        key={item.title}
                        className="border-b border-neutral-100 py-3"
                      >
                        <Link
                          href={item.path}
                          prefetch={true}
                          onClick={onClose}
                          className="block text-4xl font-bold tracking-tight text-black"
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.title} className="border-b border-neutral-100">
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded(isExpanded ? null : item.title)
                        }
                        className="flex w-full items-center justify-between py-3 text-left"
                      >
                        <span className="text-4xl font-bold tracking-tight text-black">
                          {item.title}
                        </span>
                        <ChevronDownIcon
                          className={clsx(
                            "h-5 w-5 flex-none text-neutral-500 transition-transform duration-300",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                      <div
                        className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                        style={{
                          gridTemplateRows: isExpanded ? "1fr" : "0fr",
                        }}
                      >
                        <div className="min-h-0">
                          <ul className="flex flex-col gap-1 pb-4 pl-1">
                            {megaEntry.primaryLinks.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.path}
                                  prefetch={true}
                                  onClick={onClose}
                                  className="block py-1.5 text-lg text-neutral-700"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <ul className="mt-8 flex flex-col gap-1">
                {UTILITY_LINKS.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      prefetch={true}
                      onClick={onClose}
                      className="block py-1.5 text-base text-neutral-500"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
                {menu.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      prefetch={true}
                      onClick={onClose}
                      className="block py-1.5 text-base text-neutral-500"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
