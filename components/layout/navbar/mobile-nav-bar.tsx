"use client";

import CartModal from "components/cart/modal";
import NavFavorites from "components/favorites/nav-favorites";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenuPanel from "./mobile-menu-panel";
import MobileSearchPanel from "./mobile-search-panel";

type ActivePanel = "search" | "menu" | null;

/**
 * Barra de navegación móvil fija al pie de pantalla — inspirada en el
 * patrón mobile de On Running (on.com): 5 íconos (Buscar, Favoritos,
 * Bolsa, Cuenta, Menú), transparente sobre el hero y sólida al hacer
 * scroll (misma prop `transparent` que ya gobierna el navbar desktop en
 * `nav-main.tsx`). Reemplaza el botón de hamburguesa + carrito/favoritos
 * sueltos que antes vivían en la fila principal solo en mobile.
 *
 * El último ícono hace de "cerrar" universal: mientras cualquiera de los
 * dos paneles (buscador o menú) está abierto, se convierte en una X —
 * igual que el patrón de On, donde el ícono de menú siempre cierra lo que
 * esté abierto sin importar cuál se abrió.
 */
export default function MobileNavBar({
  menu,
  transparent,
}: {
  menu: Menu[];
  transparent: boolean;
}) {
  const pathname = usePathname();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  useEffect(() => {
    setActivePanel(null);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePanel(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const isPanelOpen = activePanel !== null;
  const isProductPage = pathname.startsWith("/product/");
  // En la página de producto, el botón de Añadir al carrito ocupa el
  // lugar de la fila de íconos — al abrir el menú (☰), se hace crossfade
  // hacia la fila normal (buscar/favoritos/carrito/cuenta) en vez de que
  // ambos convivan encimados. Se usa opacidad apilada (no unmount) para
  // que el nodo #mobile-add-to-cart-portal nunca se desmonte: el portal
  // de AddToCart lo agarra una sola vez al montar.
  const showAddToCart = isProductPage && !isPanelOpen;

  const icons = (
    <>
      <button
        type="button"
        aria-label="Buscar"
        onClick={() =>
          setActivePanel((p) => (p === "search" ? null : "search"))
        }
        className={clsx(
          "flex h-11 w-11 items-center justify-center transition-colors",
          transparent && !isPanelOpen ? "text-white" : "text-black",
          activePanel === "search" && "opacity-60",
        )}
      >
        <MagnifyingGlassIcon className="h-6 w-6" strokeWidth={2} />
      </button>

      <NavFavorites transparent={transparent && !isPanelOpen} />
      <CartModal transparent={transparent && !isPanelOpen} />

      <Link
        href="/cuenta"
        prefetch={true}
        aria-label="Mi cuenta"
        className={clsx(
          "flex h-11 w-11 items-center justify-center transition-colors",
          transparent && !isPanelOpen ? "text-white" : "text-black",
        )}
      >
        <UserIcon className="h-6 w-6" strokeWidth={2} />
      </Link>
    </>
  );

  return (
    <div className="md:hidden">
      <div
        className={clsx(
          "fixed inset-x-0 bottom-0 z-[60] transition-colors duration-500",
          transparent && !isPanelOpen
            ? "bg-gradient-to-t from-black/55 via-black/20 to-transparent"
            : clsx("bg-white", !isPanelOpen && "border-t border-neutral-200"),
        )}
      >
        <div
          className="mx-auto flex max-w-screen-2xl items-center px-2 pt-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.6rem)" }}
        >
          {isProductPage ? (
            <div className="relative h-12 flex-1">
              <div
                className={clsx(
                  "absolute inset-0 flex items-center justify-around transition-opacity duration-300",
                  showAddToCart
                    ? "pointer-events-none opacity-0"
                    : "opacity-100",
                )}
              >
                {icons}
              </div>
              <div
                id="mobile-add-to-cart-portal"
                className={clsx(
                  "absolute inset-0 flex items-center pr-2 transition-opacity duration-300",
                  showAddToCart
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",
                )}
              />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-around">
              {icons}
            </div>
          )}

          <button
            type="button"
            aria-label={isPanelOpen ? "Cerrar" : "Menú"}
            onClick={() =>
              setActivePanel((p) => (p === null ? "menu" : null))
            }
            className={clsx(
              "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
              isPanelOpen
                ? "bg-black text-white"
                : transparent
                  ? "text-white"
                  : "text-black",
            )}
          >
            {isPanelOpen ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      <MobileSearchPanel
        isOpen={activePanel === "search"}
        onClose={() => setActivePanel(null)}
      />
      <MobileMenuPanel
        isOpen={activePanel === "menu"}
        onClose={() => setActivePanel(null)}
        menu={menu}
      />
    </div>
  );
}
