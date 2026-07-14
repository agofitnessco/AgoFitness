"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Menu } from "lib/shopify/types";
import NavMain from "./nav-main";

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

  const transparent = isHome && !scrolled;

  return (
    <div
      className={clsx(
        "left-0 right-0 top-0 z-40",
        transparent ? "absolute" : "sticky",
      )}
    >
      <div
        className={clsx(
          "transition-colors duration-500",
          transparent ? "bg-transparent" : "bg-[#b48b8c]",
        )}
      >
        <div className="mx-auto flex h-9 max-w-screen-2xl items-center justify-end gap-6 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-white lg:px-8">
          <Link href="/soporte" prefetch={true} className="hover:opacity-80">
            Ayuda
          </Link>
          <Link href="/cuenta" prefetch={true} className="hover:opacity-80">
            Mi cuenta
          </Link>
        </div>
      </div>

      <NavMain siteName={siteName} menu={menu} transparent={transparent} />
    </div>
  );
}
