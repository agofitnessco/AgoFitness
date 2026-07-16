"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { LegalAccordion, type LegalSection } from "components/legal-accordion";
import Link from "next/link";
import { useMemo, useState } from "react";

const linkClass = "font-medium text-black underline underline-offset-2";

const FAQS: LegalSection[] = [
  {
    title: "¿Dónde puedo comprobar el estado de mi pedido?",
    body: (
      <p>
        Inicia sesión en{" "}
        <Link href="/cuenta" className={linkClass}>
          tu cuenta
        </Link>{" "}
        para ver el historial de tus pedidos. El tracking en vivo por
        paquetería está pendiente de conectar.
      </p>
    ),
  },
  {
    title: "¿Cómo devuelvo un pedido?",
    body: (
      <p>
        Escríbenos con el formulario de esta página o a{" "}
        <a href="mailto:hola@agofitness.com" className={linkClass}>
          hola@agofitness.com
        </a>
        . La política detallada de cambios y devoluciones sigue en
        definición — puedes ver lo confirmado hasta ahora en{" "}
        <Link href="/terminos" className={linkClass}>
          Términos y Condiciones
        </Link>
        .
      </p>
    ),
  },
  {
    title: "¿Qué talla debo pedir?",
    body: (
      <p>
        Revisa nuestra{" "}
        <Link href="/guia-de-tallas" className={linkClass}>
          guía de tallas
        </Link>{" "}
        con medidas reales por prenda. Si sigues con dudas, escríbenos con
        este formulario.
      </p>
    ),
  },
  {
    title: "¿A dónde hacen envíos?",
    body: (
      <p>
        México es nuestro mercado principal. La paquetería y los tiempos de
        entrega exactos por zona todavía están en definición — se
        publicarán en cuanto estén confirmados.
      </p>
    ),
  },
  {
    title: "¿Cómo pago mi pedido?",
    body: (
      <p>
        El pago se procesa de forma segura en el checkout de Shopify, en
        pesos mexicanos (MXN).
      </p>
    ),
  },
  {
    title: "¿Cómo edito mis datos o direcciones guardadas?",
    body: (
      <p>
        Desde{" "}
        <Link href="/cuenta" className={linkClass}>
          tu cuenta
        </Link>{" "}
        puedes editar tu perfil y tus direcciones de envío en cualquier
        momento.
      </p>
    ),
  },
];

export default function ContactFaq() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => f.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-black">
        Preguntas más frecuentes
      </h2>
      <div className="mt-6 flex items-center gap-3 rounded-lg bg-neutral-100 px-4 py-3">
        <MagnifyingGlassIcon className="h-4 w-4 flex-none text-neutral-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca la respuesta"
          className="w-full bg-transparent text-sm text-black placeholder:text-neutral-500 focus:outline-none"
        />
      </div>

      {filtered.length > 0 ? (
        <LegalAccordion
          key={query}
          sections={filtered}
          numbered={false}
          defaultOpenIndex={null}
          className="mt-6"
        />
      ) : (
        <p className="mt-8 text-sm text-neutral-500">
          No encontramos nada con ese término. Escríbenos directamente con
          el formulario.
        </p>
      )}
    </div>
  );
}
