import FillButton from "components/ui/fill-button";
import Image from "next/image";
import Link from "next/link";

/**
 * Ver docs/navbar.md para el patrón de navbar transparente que depende de
 * este componente ocupando la primera pantalla completa.
 */
export default function Hero() {
  return (
    <section className="relative flex h-[100svh] w-full flex-col justify-end overflow-hidden">
      <Image
        src="/imgs/hero/banner-1-mobile.jpg"
        alt="Ago Fitness — nueva colección"
        fill
        priority
        sizes="100vw"
        className="object-cover sm:hidden"
      />
      <Image
        src="/imgs/hero/banner-1.jpg"
        alt="Ago Fitness — nueva colección"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover sm:block"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/5 to-black/70" />

      <div className="relative z-10 px-6 pb-20 sm:pb-24 lg:px-16 lg:pb-28">
        <p
          className="hero-fade text-xs font-bold uppercase tracking-[0.25em] text-white/80"
          style={{ animationDelay: "0.1s" }}
        >
          Nueva colección
        </p>
        <h1
          className="hero-fade mt-4 max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl"
          style={{ animationDelay: "0.2s" }}
        >
          Feel strong.
          <br />
          Live confident.
        </h1>
        <p
          className="hero-fade mt-6 max-w-md text-base text-white/85 lg:text-lg"
          style={{ animationDelay: "0.32s" }}
        >
          Activewear diseñado para moverse contigo — rendimiento real, sin
          sacrificar estilo.
        </p>
        <div
          className="hero-fade mt-8 flex items-center gap-6"
          style={{ animationDelay: "0.44s" }}
        >
          <div className="hidden sm:block">
            <FillButton href="#nueva-coleccion" size="md" variant="light" arrowDirection="down" className="-ml-9">
              Conoce la nueva colección
            </FillButton>
          </div>
          <div className="block sm:hidden">
            <FillButton href="#nueva-coleccion" size="sm" variant="light" arrowDirection="down" className="-ml-5">
              Conoce la nueva colección
            </FillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
