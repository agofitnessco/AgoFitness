import FillButton from "components/ui/fill-button";

/**
 * Placeholder de marca — mismo gradiente que `layout/hero.tsx` (rosa de
 * marca #b48b8c → negro), sustituir por fotografía real cuando esté
 * disponible. Requiere que `/nosotros` esté en `TRANSPARENT_HERO_PATHS`
 * (`navbar-shell.tsx`) para que el navbar flote transparente encima.
 */
export default function AboutHero() {
  return (
    <section className="relative flex h-[100svh] w-full flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_140%_90%_at_50%_-10%,#d9b7b8_0%,#8f6566_42%,#241819_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/5 to-black/70" />

      <div className="relative z-10 px-6 pb-20 sm:pb-24 lg:px-16 lg:pb-28">
        <p
          className="hero-fade text-xs font-bold uppercase tracking-[0.25em] text-white/80"
          style={{ animationDelay: "0.1s" }}
        >
          Sobre Ago Fitness
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
          No hacemos ropa deportiva porque sí — la hacemos porque cómo te
          mueves cambia cómo te sientes. Esta es la idea detrás de Ago
          Fitness.
        </p>
        <div
          className="hero-fade mt-8 flex items-center gap-6"
          style={{ animationDelay: "0.44s" }}
        >
          <div className="hidden sm:block">
            <FillButton
              href="#historia"
              size="md"
              variant="light"
              arrowDirection="down"
              className="-ml-9"
            >
              Nuestra historia
            </FillButton>
          </div>
          <div className="block sm:hidden">
            <FillButton
              href="#historia"
              size="sm"
              variant="light"
              arrowDirection="down"
              className="-ml-5"
            >
              Nuestra historia
            </FillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
