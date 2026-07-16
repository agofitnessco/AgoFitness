"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Talla y ajuste",
    body: (
      <>
        Consulta las medidas reales por talla en nuestra{" "}
        <Link
          href="/guia-de-tallas"
          className="font-medium text-black underline underline-offset-2"
        >
          guía de tallas
        </Link>
        . El ajuste específico de esta prenda se confirma pronto.
      </>
    ),
  },
  {
    title: "Envío y devolución",
    body: (
      <>
        Estamos terminando de definir tiempos de envío y política de
        devoluciones.{" "}
        <Link
          href="/soporte"
          className="font-medium text-black underline underline-offset-2"
        >
          Escríbenos
        </Link>{" "}
        si tienes dudas mientras tanto.
      </>
    ),
  },
  {
    title: "Instrucciones de cuidado",
    body: "Pendiente — instrucciones de cuidado por línea (Element/Kisu).",
  },
  {
    title: "Materiales y transparencia",
    body: "Pendiente — composición de tela por prenda.",
  },
];

export function ProductInfoAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t border-neutral-200">
      {SECTIONS.map((section, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={section.title} className="border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left text-xs font-bold tracking-[0.14em] text-black uppercase"
            >
              {section.title}
              <span
                className={clsx(
                  "relative h-4 w-4 flex-none transition-transform duration-300",
                  isOpen && "rotate-45",
                )}
              >
                <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 bg-black" />
                <span className="absolute top-0 left-1/2 h-4 w-[1.5px] -translate-x-1/2 bg-black" />
              </span>
            </button>
            <div
              className={clsx(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden text-sm leading-relaxed text-neutral-600">
                {section.body}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
