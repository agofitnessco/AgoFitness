import { InstagramIcon } from "components/icons/social";
import { PhoneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

/**
 * Banner de distribuidor (Ago × Gymco) entre los dos carruseles del home.
 * El cliente mandó un diseño propio (gradiente dorado/rosa, hojas de
 * palma, QR) que no combina con la estética del sitio — esta versión toma
 * solo el contenido real (marca, "Distribuidora autorizada", contacto de
 * Adriana Godoy) y lo viste como el resto de tarjetas del sitio: contenida
 * dentro del mismo `max-w-screen-2xl` que las demás secciones (no full
 * bleed), `rounded-lg` + gradiente suave de marca (mismo lenguaje que
 * `CategoryShowcase`/`HeroCard`), no una franja plana. Sin QR — innecesario,
 * el link de Instagram ya cumple esa función.
 */
export default function GymcoBanner() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-4 lg:px-8">
      <div className="relative overflow-hidden rounded-lg border border-[#b48b8c]/20 bg-gradient-to-br from-[#b48b8c]/12 via-white to-[#b48b8c]/[0.06] px-6 py-6 shadow-sm sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Image
              src="/imgs/logo-ago.png"
              alt="Ago"
              width={80}
              height={80}
              className="h-9 w-auto"
            />
            <span className="text-lg font-light text-[#b48b8c]/50">×</span>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-black">GYM</span>
              <span className="text-[#b48b8c]">CO</span>
            </span>
            <span className="hidden h-5 w-px bg-[#b48b8c]/25 sm:block" />
            <span className="rounded-full bg-[#b48b8c]/12 px-3 py-1 text-xs font-bold tracking-[0.1em] text-[#8a6a6b] uppercase">
              Distribuidora autorizada
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-700">
            <a
              href="tel:+525522406934"
              className="flex items-center gap-2 transition-colors hover:text-[#8a6a6b]"
            >
              <PhoneIcon className="h-4 w-4 text-[#b48b8c]" />
              55 22 40 69 34
            </a>
            <a
              href="https://www.instagram.com/agofitnessco/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-[#8a6a6b]"
            >
              <InstagramIcon className="h-4 w-4 text-[#b48b8c]" />
              @agofitnessco
            </a>
            <span className="text-neutral-500">
              Ropa deportiva de alta calidad
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
