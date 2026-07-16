"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Menu } from "lib/shopify/types";
import { CartPanel } from "components/cart/modal";
import NavMain from "./nav-main";
import MobileNavBar from "./mobile-nav-bar";

/**
 * Mensajes de la barra superior — rotan cada 4s con fade (`.topbar-fade`,
 * `app/globals.css`). Solo copy ya confirmado en el sitio, nada inventado:
 * "Nueva colección" es el copy real del hero (`layout/hero.tsx`), el pago
 * encriptado es un hecho de la arquitectura (checkout 100% tokenizado, sin
 * mencionar el proveedor — ver `docs/arquitectura.md`), y el Instagram es
 * el real del footer.
 */
const TOP_BAR_MESSAGES = [
  "Nueva colección disponible",
  "Pago 100% seguro y encriptado",
  "Síguenos en Instagram @agofitnessco",
];

/**
 * Solo en el home el navbar arranca transparente sobre el hero (imagen a
 * pantalla completa) y se vuelve sólido al hacer scroll. En el resto de
 * páginas (sin hero de imagen debajo) se queda sólido siempre — ver
 * docs/navbar.md.
 */
export default function NavbarShell({
  siteName,
  menu,
}: {
  siteName: string;
  menu: Menu[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(
      () => setMessageIndex((i) => (i + 1) % TOP_BAR_MESSAGES.length),
      4000,
    );
    return () => clearInterval(interval);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <>
      <div
        className={clsx(
          "left-0 right-0 top-0 z-40",
          transparent ? "absolute" : "absolute md:sticky",
        )}
      >
        <div
          className={clsx(
            "transition-colors duration-500 hidden md:block",
            transparent ? "bg-transparent" : "bg-[#b48b8c]",
          )}
        >
          <div className="mx-auto flex h-9 max-w-screen-2xl items-center justify-between gap-6 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-white lg:px-8">
            <div className="hidden overflow-hidden sm:block">
              <span key={messageIndex} className="topbar-fade inline-block">
                {TOP_BAR_MESSAGES[messageIndex]}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-6">
              <Link
                href="/soporte"
                prefetch={true}
                className="hover:opacity-80"
              >
                Ayuda
              </Link>
              <Link href="/cuenta" prefetch={true} className="hover:opacity-80">
                Mi cuenta
              </Link>
            </div>
          </div>
        </div>

        <NavMain siteName={siteName} menu={menu} transparent={transparent} />
      </div>
      <MobileNavBar menu={menu} transparent={transparent} />
      <CartPanel />
    </>
  );
}
