"use client";

import CartModal from "components/cart/modal";
import { Flip } from "gsap/Flip";
import gsap from "gsap";
import { CATEGORY_LINKS, POPULAR_SEARCH_TERMS } from "lib/constants";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState, Suspense } from "react";
import MobileMenu from "./mobile-menu";
import MegaMenu from "./mega-menu";
import { Menu } from "lib/shopify/types";

gsap.registerPlugin(Flip);

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

  const linksRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const megaCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                  placeholder="Buscar"
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
              className="overflow-hidden"
              style={{
                width: isSearchOpen ? 0 : "auto",
                opacity: isSearchOpen ? 0 : 1,
                pointerEvents: isSearchOpen ? "none" : "auto",
              }}
            >
              <CartModal transparent={transparent} />
            </div>
          </div>

          <div className="flex items-center gap-3 md:hidden">
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
        className="overflow-hidden border-t border-neutral-200"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-8">
          <p className="text-sm text-neutral-500">
            Términos de búsqueda populares
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR_SEARCH_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                data-chip
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                  closeSearch();
                }}
                className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
