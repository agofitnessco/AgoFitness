"use client";

import Footer from "components/layout/footer";
import HeartButton from "components/favorites/heart-button";
import { productGradient } from "lib/color-placeholder";
import { useFavorites } from "lib/use-favorites";
import Link from "next/link";

export default function FavoritosPage() {
  const favorites = useFavorites();

  return (
    <>
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-12 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-black lg:text-5xl">
          Favoritos
        </h1>

        {favorites.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            <p>Todavía no has guardado ningún producto.</p>
            <Link
              href="/search/mujer"
              prefetch={true}
              className="mt-3 inline-block font-medium text-black underline"
            >
              Explorar Mujer
            </Link>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {favorites.map((item) => (
              <li key={item.handle} className="group">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                  <Link
                    href={`/product/${item.handle}`}
                    prefetch={true}
                    className="absolute inset-0"
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ backgroundImage: productGradient(item.colorHex) }}
                    />
                  </Link>
                  <HeartButton item={item} />
                </div>
                <p className="mt-3 text-sm font-semibold">{item.title}</p>
                <p className="text-sm text-neutral-500">
                  MX${Number(item.price).toLocaleString("es-MX")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Footer />
    </>
  );
}
