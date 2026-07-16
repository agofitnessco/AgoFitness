/**
 * Copy genérico de marca — no se inventan fundadores, año de fundación ni
 * cifras. La nota "Pendiente" (mismo patrón que `app/privacidad/page.tsx`)
 * marca el hueco a llenar en cuanto el cliente comparta la historia real.
 */
export default function AboutStory() {
  return (
    <section
      id="historia"
      className="mx-auto w-full max-w-screen-xl px-4 py-20 lg:px-8 lg:py-28"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
            Nuestra historia
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-black lg:text-4xl">
            Nace de la idea de que moverse debería sentirse tan bien como se
            ve.
          </h2>
        </div>

        <div className="flex flex-col gap-6 text-lg leading-relaxed text-neutral-600">
          <p>
            Ago Fitness empezó como una inconformidad simple: la mayoría de
            la ropa deportiva se diseña para verse bien en una foto, no para
            resistir un entrenamiento real. Quisimos construir algo distinto
            — piezas que aguantan el movimiento del día a día y que, de
            paso, se ven tan bien como se sienten.
          </p>
          <p>
            Esa idea sigue siendo el filtro con el que decidimos qué hacer y
            qué no: cada pieza pasa por gente que realmente entrena antes de
            llegar a la tienda. Si no sobrevive al uso real, no sale.
          </p>
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-4 text-sm text-neutral-600">
            <span className="font-semibold text-black">Pendiente: </span>
            la historia real de cómo y cuándo nació Ago Fitness — quién la
            empezó, en qué año y qué la detonó. Se agrega aquí en cuanto el
            cliente la comparta.
          </div>
        </div>
      </div>
    </section>
  );
}
