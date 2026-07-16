import clsx from "clsx";

/**
 * Dos pilares de marca (producto + comunidad) en filas alternadas —
 * equivalente a los bloques temáticos de la referencia (On: Sostenibilidad
 * / Producto por Atletas). Imagen placeholder con gradiente de marca,
 * mismo lenguaje que `category-showcase.tsx` — sustituir por fotografía
 * real cuando esté disponible.
 */
const PILLARS = [
  {
    eyebrow: "01 — Producto",
    title: "Rendimiento real, no solo la promesa de una etiqueta.",
    body: "Telas técnicas que respiran, ajuste probado en movimiento real y piezas pensadas para durar más de una temporada. Antes de que algo lleve el nombre de Ago Fitness, se prueba entrenando — no solo posando.",
    features: [
      "Telas técnicas que respiran",
      "Ajuste probado en movimiento real",
      "Hecho para durar, no solo para una temporada",
    ],
    tint: "from-[#d9b7b8] via-[#8f6566] to-[#241819]",
    reverse: false,
  },
  {
    eyebrow: "02 — Comunidad",
    title: "Un movimiento, no solo una marca.",
    body: "Diseñamos para quien va empezando y para quien no se pierde un entrenamiento. No hay un solo tipo de cuerpo o nivel al que le hablamos — hay una comunidad que se mueve, a su manera, todos los días.",
    features: [
      "Para todos los niveles, sin excepción",
      "Comunidad activa, no solo clientes",
      "Diseñado para el movimiento diario",
    ],
    tint: "from-[#9aa0ab] via-[#3f434d] to-[#131417]",
    reverse: true,
  },
];

export default function AboutPillars() {
  return (
    <section className="mx-auto w-full max-w-screen-xl px-4 py-10 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-20 lg:gap-28">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.eyebrow}
            className={clsx(
              "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16",
            )}
          >
            <div
              className={clsx(
                "relative aspect-[4/5] w-full overflow-hidden rounded-lg",
                pillar.reverse && "lg:order-2",
              )}
            >
              <div
                className={clsx(
                  "absolute inset-0 bg-gradient-to-br",
                  pillar.tint,
                )}
              />
            </div>

            <div className={clsx(pillar.reverse && "lg:order-1")}>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                {pillar.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-black lg:text-4xl">
                {pillar.title}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
                {pillar.body}
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {pillar.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-base font-medium text-black"
                  >
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#b48b8c]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
