import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CATEGORY_LINKS } from "lib/constants";
import Link from "next/link";

/**
 * Placeholder de marca por categoría — sustituir el div de fondo por
 * fotografía real de producto/modelo cuando esté disponible. Mismo
 * lenguaje visual que `HeroCard` en mega-menu.tsx (gradiente + overlay +
 * label + botón circular), reutilizado aquí para la sección de home.
 */
const CATEGORY_TINTS: Record<string, string> = {
  Mujer: "from-[#d9b7b8] via-[#8f6566] to-[#241819]",
  Hombre: "from-[#9aa0ab] via-[#3f434d] to-[#131417]",
  "Niños": "from-[#cdd8a8] via-[#5f6b45] to-[#1a2013]",
};

export default function CategoryShowcase() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-4 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {CATEGORY_LINKS.map((category) => (
          <Link
            key={category.title}
            href={category.path}
            prefetch={true}
            className="group relative flex aspect-[3/4] w-full flex-col justify-end overflow-hidden rounded-lg"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_TINTS[category.title]} transition-transform duration-700 ease-out group-hover:scale-105`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-transparent" />
            <div className="relative z-10 flex items-center justify-between p-6">
              <span className="text-2xl font-bold tracking-tight text-white">
                {category.title}
              </span>
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white text-black transition-transform duration-300 ease-out group-hover:translate-x-1">
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
