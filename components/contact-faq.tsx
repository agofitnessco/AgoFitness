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
        No necesitas crear una cuenta para comprar, pero si la creas
        puedes ver el historial completo de tus pedidos desde{" "}
        <Link href="/cuenta" className={linkClass}>
          tu cuenta
        </Link>
        . El tracking en vivo por paquetería está pendiente de conectar
        — mientras tanto, escríbenos y te confirmamos el estatus.
      </p>
    ),
  },
  {
    title: "¿Cómo devuelvo un pedido?",
    body: (
      <p>
        Si tu pedido llega con un defecto o no corresponde a lo que
        ordenaste, contáctanos y lo resolvemos sin costo para ti. Fuera
        de esos casos, aceptamos cambios y devoluciones dentro de los 15
        días naturales posteriores a la entrega, con la prenda sin usar y
        etiqueta original; el envío de regreso corre por tu cuenta.
        Escríbenos con el formulario de esta página o a{" "}
        <a href="mailto:hola@agofitness.com" className={linkClass}>
          hola@agofitness.com
        </a>{" "}
        — revisa el detalle completo en{" "}
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
        Cada prenda muestra su ajuste (ajustado, estándar u holgado) en
        la ficha de producto — úsalo junto con nuestra{" "}
        <Link href="/guia-de-tallas" className={linkClass}>
          guía de tallas
        </Link>{" "}
        de medidas reales por prenda. Si sigues con dudas, escríbenos con
        este formulario antes de comprar.
      </p>
    ),
  },
  {
    title: "¿A dónde hacen envíos?",
    body: (
      <p>
        Enviamos por DHL a toda la República Mexicana ($150 MXN). Tu
        pedido se procesa y despacha en 24–48 horas hábiles; la entrega
        estimada de DHL es de 1 a 3 días hábiles en zonas urbanas
        principales (CDMX, Guadalajara, Monterrey y otras capitales) y
        hasta 5 días hábiles en el resto del país.
      </p>
    ),
  },
  {
    title: "¿Cómo pago mi pedido?",
    body: (
      <p>
        El pago se procesa de forma segura en el checkout de Shopify, en
        pesos mexicanos (MXN) con tarjeta de crédito o débito (Visa,
        Mastercard, American Express). No almacenamos el número completo
        de tu tarjeta. ¿Necesitas factura? Escríbenos con este formulario.
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
        puedes editar tu perfil, tus direcciones de envío y consultar tu
        historial de pedidos en cualquier momento.
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
