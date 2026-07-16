import FillButton from "components/ui/fill-button";

export default function AboutCta() {
  return (
    <section className="bg-[#241819] px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
        <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white lg:text-5xl">
          ¿Listo para moverte con nosotros?
        </h2>
        <div className="flex flex-none flex-wrap items-center gap-4">
          <FillButton href="/" variant="light">
            Descubre la colección
          </FillButton>
          <FillButton href="/contacto" variant="light" showArrow={false}>
            Trabaja con nosotros
          </FillButton>
        </div>
      </div>
    </section>
  );
}
