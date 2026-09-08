"use client";

import clsx from "clsx";
import { fitFor } from "lib/product-types";
import { Product } from "lib/shopify/types";
import Link from "next/link";
import { useState } from "react";

/**
 * Antes esta sección era texto genérico idéntico para los ~40 productos
 * del catálogo ("el ajuste se confirma pronto", envío "en definición" —
 * ya no es cierto, el envío quedó configurado en Shopify a $150 MXN plano
 * a toda la República). Talla y ajuste reutiliza `fitFor()` (misma fuente
 * que el badge "Ajuste" del feature-story) en vez de duplicar el dato.
 * Cuidado/Materiales se quedan en lenguaje honesto y genérico para tela
 * técnica de compresión — no se inventa composición exacta (%) porque
 * nadie del lado del cliente la ha confirmado todavía.
 */
function buildSections(product: Product): { title: string; body: React.ReactNode }[] {
  const fit = fitFor(product.productType, product.title);

  return [
    {
      title: "Talla y ajuste",
      body: (
        <>
          Ajuste: <span className="font-medium text-black">{fit}</span>.
          Consulta las medidas reales por talla en nuestra{" "}
          <Link
            href="/guia-de-tallas"
            className="font-medium text-black underline underline-offset-2"
          >
            guía de tallas
          </Link>
          .
        </>
      ),
    },
    {
      title: "Envío y devolución",
      body: (
        <>
          Envío estándar por DHL a toda la República Mexicana — $150 MXN.
          Tu pedido se procesa y despacha en 24–48 horas hábiles; el
          tiempo de entrega estimado de DHL es de 1 a 3 días hábiles en
          zonas urbanas principales (CDMX, Guadalajara, Monterrey y otras
          capitales) y hasta 5 días hábiles en el resto del país.
          <br />
          Cambios y devoluciones dentro de los 15 días naturales
          posteriores a la entrega, con la prenda sin usar y etiqueta
          original.{" "}
          <Link
            href="/soporte"
            className="font-medium text-black underline underline-offset-2"
          >
            Escríbenos
          </Link>{" "}
          para iniciar el proceso.
        </>
      ),
    },
    {
      title: "Instrucciones de cuidado",
      body: "Lavar a máquina con agua fría en ciclo delicado. Evitar cloro y suavizante — reducen la elasticidad de la tela técnica. Secar a la sombra o en secadora a baja temperatura. No planchar directamente sobre estampados.",
    },
    {
      title: "Materiales y transparencia",
      body: "Tela técnica de alto desempeño (stretch, transpirable). Estamos confirmando con el proveedor el desglose exacto de composición (poliéster/elastano) para publicarlo aquí.",
    },
  ];
}

export function ProductInfoAccordion({ product }: { product: Product }) {
  const SECTIONS = buildSections(product);
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
