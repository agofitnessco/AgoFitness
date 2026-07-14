"use client";

import clsx from "clsx";
import { useState } from "react";

type SizeRow = {
  talla: string;
  pecho: string;
  cintura: string;
  cadera: string;
};

/**
 * Medidas tomadas del fit guide oficial de Element (colección con la que
 * Ago Fitness abrió catálogo). CH/M/G/XG son los nombres de talla reales
 * usados en las variantes de Shopify — se remapearon desde las filas
 * S/M/L/XL del PDF de la marca (XS del PDF no se vende, se omite).
 */
const MUJER: SizeRow[] = [
  { talla: "CH", pecho: "88 – 91", cintura: "69 – 72", cadera: "93 – 96" },
  { talla: "M", pecho: "92 – 95", cintura: "74 – 77", cadera: "98 – 101" },
  { talla: "G", pecho: "96 – 101", cintura: "79 – 85", cadera: "103 – 108" },
  { talla: "XG", pecho: "102 – 108", cintura: "86 – 92", cadera: "109 – 115" },
];

const HOMBRE: SizeRow[] = [
  { talla: "CH", pecho: "87 – 92", cintura: "75 – 80", cadera: "86 – 91" },
  { talla: "M", pecho: "93 – 100", cintura: "81 – 88", cadera: "92 – 99" },
  { talla: "G", pecho: "101 – 108", cintura: "89 – 96", cadera: "100 – 107" },
];

const HOW_TO_MEASURE = [
  { label: "Pecho", desc: "Rodea la parte con más volumen." },
  { label: "Cintura", desc: "Rodea la parte más estrecha." },
  {
    label: "Cadera",
    desc: "Rodea la parte más ancha mientras estás de pie.",
  },
  { label: "Tiro", desc: "De la entrepierna al suelo." },
];

function SizeTable({ rows }: { rows: SizeRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-bold tracking-wide text-neutral-500 uppercase">
            <th className="px-5 py-3.5">Talla</th>
            <th className="px-5 py-3.5">Pecho (cm)</th>
            <th className="px-5 py-3.5">Cintura (cm)</th>
            <th className="px-5 py-3.5">Cadera (cm)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.talla}
              className={clsx(
                "border-b border-neutral-100 last:border-0",
                i % 2 === 1 && "bg-neutral-50/60",
              )}
            >
              <td className="px-5 py-3.5 font-bold text-black">
                {row.talla}
              </td>
              <td className="px-5 py-3.5 text-neutral-700">{row.pecho}</td>
              <td className="px-5 py-3.5 text-neutral-700">{row.cintura}</td>
              <td className="px-5 py-3.5 text-neutral-700">{row.cadera}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuide() {
  const [tab, setTab] = useState<"mujer" | "hombre">("mujer");

  return (
    <section className="mx-auto w-full max-w-screen-lg px-4 py-20 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-black lg:text-5xl">
        Guía de tallas
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-600">
        Mide con una cinta métrica y compara con nuestra tabla para elegir tu
        talla. Todas las medidas están en centímetros.
      </p>

      <div className="mt-10 inline-flex rounded-full border border-neutral-200 bg-neutral-50 p-1">
        {(["mujer", "hombre"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={clsx(
              "rounded-full px-6 py-2 text-sm font-bold tracking-wide uppercase transition-colors",
              tab === key
                ? "bg-black text-white"
                : "text-neutral-500 hover:text-black",
            )}
          >
            {key === "mujer" ? "Mujer" : "Hombre"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <SizeTable rows={tab === "mujer" ? MUJER : HOMBRE} />
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-4 text-sm text-neutral-600">
        <span className="font-semibold text-black">Línea Kisu</span>{" "}
        (conjuntos, leggings, enterizos) usa tallas S/M/L/XL — la tabla de
        medidas específica para esta línea está pendiente de que el
        proveedor la comparta. Mientras tanto, contáctanos por{" "}
        <a href="mailto:hola@agofitness.com" className="underline">
          correo
        </a>{" "}
        si necesitas ayuda para elegir talla en estas piezas.
      </div>

      <h2 className="mt-16 text-2xl font-bold tracking-tight text-black">
        Cómo medir
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {HOW_TO_MEASURE.map((step, i) => (
          <div key={step.label} className="flex gap-4">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-bold text-black">{step.label}</p>
              <p className="mt-1 text-sm text-neutral-600">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
