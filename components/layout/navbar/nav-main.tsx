"use client";

import CartModal from "components/cart/modal";
import NavFavorites from "components/favorites/nav-favorites";
import ProductCard from "components/collection/product-card";
import { Flip } from "gsap/Flip";
import gsap from "gsap";
import { CATEGORY_LINKS, POPULAR_SEARCH_TERMS } from "lib/constants";
import { colorHex, productGradient } from "lib/color-placeholder";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, Suspense } from "react";
import MobileMenu from "./mobile-menu";
import MegaMenu from "./mega-menu";
import { Menu, Product } from "lib/shopify/types";

gsap.registerPlugin(Flip);

const NEUTRAL_HEX = "#c9c9c4";

function firstColorHex(product: Product): string {
  const colorValue = product.variants[0]?.selectedOptions.find(
    (o) => o.name.toLowerCase() === "color",
  )?.value;
  return colorValue ? colorHex(colorValue) : NEUTRAL_HEX;
}

/**
 * Tarjeta compacta usada SOLO en el panel de búsqueda cuando el navbar está
 * transparente (sobre el hero) — el `ProductCard` real (aspect 3/4 grande,
 * swatches, quick-add) tapaba el copy del hero. Texto blanco fijo porque
 * este componente nunca se renderiza sobre fondo sólido.
 */
function MiniProductCard({
  product,
  onNavigate,
}: {
  product: Product;
  onNavigate: () => void;
}) {
  const price = product.priceRange.minVariantPrice;
  return (
    <li data-panel-item className="w-24 flex-none sm:w-28">
      <Link
        href={`/product/${product.handle}`}
        prefetch={true}
        onClick={onNavigate}
        className="group block"
      >
        <div
          className="aspect-[3/4] w-full overflow-hidden rounded-md"
          style={{ backgroundImage: productGradient(firstColorHex(product)) }}
        />
        <p className="mt-2 truncate text-xs font-medium text-white">
          {product.title}
        </p>
        <p className="text-xs text-white/70">
          MX${Number(price.amount).toLocaleString("es-MX")}
        </p>
      </Link>
    </li>
  );
}

export default function NavMain({
  siteName,
  menu,
  transparent = false,
}: {
  siteName: string;
  menu: Menu[];
  transparent?: boolean;
}) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [suggestProducts, setSuggestProducts] = useState<Product[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  // Layout que se renderiza realmente en el panel de búsqueda — va un paso
  // detrás de `transparent` durante el crossfade (ver efectos más abajo).
  const [displayTransparent, setDisplayTransparent] = useState(transparent);

  const linksRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const megaCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTransparentRef = useRef(transparent);

  const openMegaMenu = (title: string) => {
    if (megaCloseTimeout.current) clearTimeout(megaCloseTimeout.current);
    setActiveCategory(title);
  };

  const scheduleMegaClose = () => {
    megaCloseTimeout.current = setTimeout(() => setActiveCategory(null), 150);
  };

  useLayoutEffect(() => {
    const panel = megaMenuRef.current;
    if (!panel) return;

    if (activeCategory) {
      gsap.killTweensOf(panel);
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" },
      );
      const cols = panel.querySelectorAll("[data-mega-col]");
      gsap.fromTo(
        cols,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, delay: 0.05 },
      );
    } else {
      gsap.killTweensOf(panel);
      gsap.to(panel, {
        autoAlpha: 0,
        y: -8,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [activeCategory]);

  const flipTargets = () =>
    [linksRef.current, searchWrapRef.current, cartRef.current].filter(
      Boolean,
    ) as Element[];

  const requestToggle = (next: boolean) => {
    flipState.current = Flip.getState(flipTargets(), { props: "opacity" });
    setIsSearchOpen(next);
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.55,
      ease: "power3.out",
      absolute: true,
    });
    flipState.current = null;

    if (isSearchOpen) {
      inputRef.current?.focus();
      if (cancelRef.current) {
        gsap.fromTo(
          cancelRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, delay: 0.15 },
        );
      }
      if (panelRef.current) {
        const chips = panelRef.current.querySelectorAll("[data-chip]");
        gsap
          .timeline()
          .fromTo(
            panelRef.current,
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" },
            0.1,
          )
          .fromTo(
            chips,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.03 },
            0.3,
          );
      }
    } else if (panelRef.current) {
      gsap.to(panelRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [isSearchOpen]);

  // Resultados en vivo bajo el panel de búsqueda (patrón On Running): al
  // abrir sin texto muestra los más vendidos (BEST_SELLING), y conforme se
  // escribe filtra por `query` (debounce 300ms para no golpear la Storefront
  // API en cada tecla). Reusa el `ProductCard` real de las colecciones —
  // mismos swatches/quick-add que el resto del sitio, sin un componente
  // paralelo que mantener sincronizado.
  useEffect(() => {
    if (!isSearchOpen) return;

    const controller = new AbortController();
    setIsSuggestLoading(true);
    const timeout = setTimeout(
      () => {
        fetch(
          `/api/search-suggest?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        )
          .then((res) => res.json())
          .then((data) => setSuggestProducts(data.products ?? []))
          .catch((err) => {
            if (err?.name !== "AbortError") setSuggestProducts([]);
          })
          .finally(() => setIsSuggestLoading(false));
      },
      query.trim() ? 300 : 0,
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [isSearchOpen, query]);

  // Transición de dos fases al cambiar entre el layout compacto (navbar
  // transparente sobre el hero: pills + tarjetas chicas a la derecha) y el
  // layout completo (navbar sólido: grid de Productos abajo) — solo si el
  // panel de búsqueda sigue abierto mientras el usuario hace scroll.
  // `displayTransparent` es el layout que realmente se renderiza; va un
  // paso detrás de `transparent` para poder animar la salida del layout
  // viejo ANTES de montar el nuevo (swap instantáneo se veía "brincado").
  useLayoutEffect(() => {
    if (!isSearchOpen) {
      prevTransparentRef.current = transparent;
      setDisplayTransparent(transparent);
      return;
    }
    if (prevTransparentRef.current === transparent) return;
    prevTransparentRef.current = transparent;

    const el = panelContentRef.current;
    if (!el) {
      setDisplayTransparent(transparent);
      return;
    }

    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      y: transparent ? 10 : -10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setDisplayTransparent(transparent),
    });
  }, [transparent, isSearchOpen]);

  // Fase 2: una vez el layout nuevo ya está montado (`displayTransparent`
  // cambió), revela el contenedor y da un stagger sutil a sus hijos
  // (pills, tarjetas/grid) — mismo lenguaje de motion que el resto del sitio
  // (power2.out, y pequeño, stagger 0.05).
  useLayoutEffect(() => {
    if (!isSearchOpen) return;
    const el = panelContentRef.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-chip], [data-panel-item]");
    gsap.killTweensOf(el);
    gsap.killTweensOf(items);
    gsap.set(el, { opacity: 1, y: 0 });
    gsap.fromTo(
      items,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 },
    );
    // Solo depende de `displayTransparent`: ese es el único evento que debe
    // disparar esta entrada (el open/close normal del panel ya tiene su
    // propio stagger de chips más abajo, en el efecto de `isSearchOpen`).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayTransparent]);

  const closeSearch = () => {
    setQuery("");
    requestToggle(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    closeSearch();
  };

  return (
    <nav
      className={clsx(
        "relative border-b transition-colors duration-500",
        transparent
          ? "border-transparent bg-transparent"
          : "border-neutral-200 bg-white/95 backdrop-blur-md",
      )}
    >
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 md:hidden">
              <Suspense fallback={null}>
                <MobileMenu menu={menu} transparent={transparent} />
              </Suspense>
            </div>

            <Link href="/" prefetch={true} className="flex items-center">
              <Image
                src="/imgs/logo-ago.png"
                alt={siteName}
                width={280}
                height={72}
                priority
                className="h-18 w-auto object-contain"
              />
            </Link>

            <div
              ref={linksRef}
              className="hidden overflow-hidden md:block"
              style={{
                width: isSearchOpen ? 0 : "auto",
                opacity: isSearchOpen ? 0 : 1,
                pointerEvents: isSearchOpen ? "none" : "auto",
              }}
            >
              <ul className="flex items-center gap-6 whitespace-nowrap">
                {CATEGORY_LINKS.map((item) => (
                  <li
                    key={item.title}
                    onMouseEnter={() => openMegaMenu(item.title)}
                    onMouseLeave={scheduleMegaClose}
                  >
                    <Link
                      href={item.path}
                      prefetch={true}
                      className={clsx(
                        "group relative text-[15px] font-bold tracking-tight transition-colors",
                        transparent
                          ? "text-white hover:text-white/80"
                          : "text-neutral-800 hover:text-black",
                      )}
                    >
                      {item.title}
                      <span
                        className={clsx(
                          "absolute -bottom-1 left-0 h-px transition-all duration-300",
                          transparent ? "bg-white" : "bg-black",
                        )}
                        style={{
                          width: activeCategory === item.title ? "100%" : 0,
                        }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
            <div
              ref={searchWrapRef}
              className="relative flex h-9 items-center rounded-full bg-neutral-100"
              style={{
                flex: isSearchOpen ? "1 1 0%" : "0 0 12rem",
              }}
            >
              <MagnifyingGlassIcon className="pointer-events-none ml-4 h-4 w-4 flex-none text-neutral-500" />
              <form onSubmit={handleSubmit} className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => !isSearchOpen && requestToggle(true)}
                  onClick={() => !isSearchOpen && requestToggle(true)}
                  placeholder="Buscar productos"
                  autoComplete="off"
                  className="w-full bg-transparent py-1.5 pl-2 pr-4 text-sm text-black placeholder:text-neutral-500 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{ outline: "none", boxShadow: "none" }}
                />
              </form>
            </div>

            {isSearchOpen ? (
              <button
                ref={cancelRef}
                type="button"
                onClick={closeSearch}
                className={clsx(
                  "flex-none text-sm font-medium hover:opacity-70",
                  transparent ? "text-white" : "text-black",
                )}
              >
                Cancelar
              </button>
            ) : null}

            <div
              ref={cartRef}
              className="flex items-center overflow-hidden"
              style={{
                width: isSearchOpen ? 0 : "auto",
                opacity: isSearchOpen ? 0 : 1,
                pointerEvents: isSearchOpen ? "none" : "auto",
              }}
            >
              <NavFavorites transparent={transparent} />
              <CartModal transparent={transparent} />
            </div>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <NavFavorites />
            <CartModal />
          </div>
        </div>
      </div>

      <div
        ref={megaMenuRef}
        onMouseEnter={() => activeCategory && openMegaMenu(activeCategory)}
        onMouseLeave={scheduleMegaClose}
        className="invisible absolute left-0 right-0 top-full z-20 border-t border-neutral-200 bg-white opacity-0 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]"
      >
        <MegaMenu activeCategory={activeCategory} />
      </div>

      <div
        ref={panelRef}
        className={clsx(
          "overflow-hidden border-t transition-colors duration-500",
          transparent ? "border-white/20" : "border-neutral-200",
        )}
        style={{ height: 0, opacity: 0 }}
      >
        <div
          ref={panelContentRef}
          className={clsx(
            "mx-auto max-w-screen-2xl px-4 py-6 lg:px-8",
            displayTransparent && "flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between",
          )}
        >
          {/* Búsquedas sugeridas — pills. Blancas con outline sobre el hero
              transparente para distinguirse; sólidas oscuras en navbar blanco. */}
          <div>
            <p
              data-panel-item
              className={clsx(
                "text-sm font-semibold",
                displayTransparent ? "text-white" : "text-neutral-900",
              )}
            >
              Búsquedas sugeridas
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {POPULAR_SEARCH_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  data-chip
                  onClick={() => {
                    setQuery(term);
                    router.push(`/search?q=${encodeURIComponent(term)}`);
                    closeSearch();
                  }}
                  className={clsx(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    displayTransparent
                      ? "border-white/50 text-white hover:border-white hover:bg-white hover:text-black"
                      : "border-neutral-300 text-neutral-800 hover:border-black hover:bg-black hover:text-white",
                  )}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {displayTransparent ? (
            // Navbar sobre el hero: tarjetas chicas junto a las pills, no un
            // grid a lo ancho — así no tapan el copy/CTA del hero debajo.
            suggestProducts.length > 0 ? (
              <div className="lg:max-w-xs lg:flex-none">
                <p className="mb-3 text-sm font-semibold text-white lg:text-right">
                  Productos
                </p>
                <ul
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("a")) closeSearch();
                  }}
                  className={clsx(
                    "flex gap-4 lg:justify-end",
                    isSuggestLoading && "opacity-50",
                  )}
                >
                  {suggestProducts.slice(0, 3).map((product) => (
                    <MiniProductCard
                      key={product.handle}
                      product={product}
                      onNavigate={closeSearch}
                    />
                  ))}
                </ul>
              </div>
            ) : query.trim() && !isSuggestLoading ? (
              <p data-panel-item className="text-sm text-white/70 lg:text-right">
                Sin resultados para{" "}
                <span className="font-semibold text-white">
                  &quot;{query.trim()}&quot;
                </span>
              </p>
            ) : null
          ) : suggestProducts.length > 0 || isSuggestLoading ? (
            <div className="mt-8">
              <p data-panel-item className="mb-4 text-sm font-semibold text-neutral-900">
                Productos
              </p>
              <ul
                data-panel-item
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("a")) closeSearch();
                }}
                className={clsx(
                  "grid grid-cols-2 gap-x-4 gap-y-8 transition-opacity duration-150 sm:grid-cols-4",
                  isSuggestLoading && "opacity-50",
                )}
              >
                {suggestProducts.map((product) => (
                  <ProductCard key={product.handle} product={product} />
                ))}
              </ul>
            </div>
          ) : query.trim() && !isSuggestLoading ? (
            <p data-panel-item className="mt-8 text-sm text-neutral-500">
              No hay productos que coincidan con{" "}
              <span className="font-semibold">&quot;{query.trim()}&quot;</span>
            </p>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
