"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type FaqItem = {
  id: string;
  title: string;
  keywords: string;
  body: React.ReactNode;
};

const linkClass = "font-medium text-black underline underline-offset-2";

const FAQS: FaqItem[] = [
  {
    id: "pedidos",
    title: "Pedidos y envío",
    keywords: "pedido envío entrega tracking rastreo guest invitado",
    body: (
      <>
        <p>
          No necesitas crear una cuenta para comprar, pero si la creas
          puedes ver el historial completo de tus pedidos desde{" "}
          <Link href="/cuenta" className={linkClass}>
            tu cuenta
          </Link>
          .
        </p>
        <p>
          Enviamos por DHL a toda la República Mexicana ($150 MXN). Tu
          pedido se procesa y despacha en 24–48 horas hábiles; el tiempo
          de entrega estimado de DHL es de 1 a 3 días hábiles en zonas
          urbanas principales (CDMX, Guadalajara, Monterrey y otras
          capitales) y hasta 5 días hábiles en el resto del país. El
          tracking en vivo por paquetería está pendiente de conectar —
          mientras tanto, cualquier duda sobre tu envío la resolvemos por
          correo.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    title: "Cambios y devoluciones",
    keywords: "cambio devolución devolver reembolso garantía defecto",
    body: (
      <p>
        Si tu pedido llega con un defecto o no corresponde a lo que
        ordenaste, contáctanos y lo resolvemos sin costo para ti. Fuera
        de esos casos, aceptamos cambios y devoluciones dentro de los 15
        días naturales posteriores a la entrega, con la prenda sin usar y
        etiqueta original; el envío de regreso corre por tu cuenta. Para
        iniciar el proceso, escríbenos con el{" "}
        <Link href="/contacto" className={linkClass}>
          formulario de contacto
        </Link>{" "}
        — revisa el detalle completo en{" "}
        <Link href="/terminos" className={linkClass}>
          Términos y Condiciones
        </Link>
        .
      </p>
    ),
  },
  {
    id: "tallas",
    title: "Talla y ajuste",
    keywords: "talla tallas ajuste medidas guia guía holgado ajustado",
    body: (
      <p>
        Cada prenda muestra su ajuste (ajustado, estándar u holgado) en
        la ficha de producto — úsalo junto con nuestra{" "}
        <Link href="/guia-de-tallas" className={linkClass}>
          guía de tallas
        </Link>{" "}
        de medidas reales en centímetros para elegir mejor. Si sigues con
        dudas sobre qué talla pedir, escríbenos con el formulario de esta
        página antes de comprar.
      </p>
    ),
  },
  {
    id: "pagos",
    title: "Pagos y facturación",
    keywords: "pago pagos facturación factura tarjeta cargo visa mastercard",
    body: (
      <p>
        El pago se procesa de forma segura en el checkout de Shopify, en
        pesos mexicanos (MXN) con tarjeta de crédito o débito (Visa,
        Mastercard, American Express). No almacenamos el número completo
        de tu tarjeta — eso lo procesa directamente la pasarela de pago.
        ¿Necesitas factura o tienes un cargo duplicado o incorrecto?
        Escríbenos de inmediato con el formulario de contacto.
      </p>
    ),
  },
  {
    id: "cuenta",
    title: "Mi cuenta",
    keywords: "cuenta perfil contraseña dirección direcciones favoritos",
    body: (
      <p>
        Desde{" "}
        <Link href="/cuenta" className={linkClass}>
          tu cuenta
        </Link>{" "}
        puedes editar tu perfil, guardar direcciones de envío, revisar tu
        historial de pedidos y recuperar tu contraseña si la olvidaste.
      </p>
    ),
  },
];

const TOPICS = [
  {
    title: "Pedidos y envío",
    question: "¿Quieres saber el estado de tu pedido o el tiempo de envío?",
    id: "pedidos",
  },
  {
    title: "Cambios y devoluciones",
    question: "¿Quieres cambiar de talla o hacer una devolución?",
    id: "cambios",
  },
  {
    title: "Talla y ajuste",
    question: "¿Quieres más información sobre nuestras tallas?",
    id: "tallas",
  },
  {
    title: "Pagos y facturación",
    question: "¿Tienes dudas sobre un cargo o cómo pagar?",
    id: "pagos",
  },
  {
    title: "Mi cuenta",
    question: "¿Necesitas editar tu perfil o direcciones?",
    id: "cuenta",
  },
];

const SUGGESTED = ["devoluciones", "talla", "envío", "pago"];

export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.keywords.toLowerCase().includes(q),
    );
  }, [query]);

  function goToSection(id: string) {
    setQuery("");
    setOpenId(id);
    requestAnimationFrame(() => {
      sectionRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-black">Temas</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => goToSection(topic.id)}
            className="rounded-xl border border-neutral-200 bg-white p-5 text-left transition-colors hover:border-black"
          >
            <p className="font-bold text-black">{topic.title}</p>
            <p className="mt-1.5 text-sm text-neutral-600">
              {topic.question}
            </p>
          </button>
        ))}
        <Link
          href="/contacto"
          className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-left transition-colors hover:border-black"
        >
          <p className="font-bold text-black">Contacto directo</p>
          <p className="mt-1.5 text-sm text-neutral-600">
            ¿No encontraste tu respuesta? Escríbenos directamente.
          </p>
        </Link>
      </div>

      <h2 className="mt-16 text-2xl font-bold tracking-tight text-black">
        Preguntas frecuentes
      </h2>
      <div className="mt-6 flex items-center gap-3 rounded-lg bg-neutral-100 px-4 py-3">
        <MagnifyingGlassIcon className="h-4 w-4 flex-none text-neutral-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca la respuesta"
          className="w-full bg-transparent text-base text-black placeholder:text-neutral-500 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="py-1.5 text-xs font-bold tracking-wide text-neutral-400 uppercase">
          Sugeridas
        </span>
        {SUGGESTED.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => setQuery(term)}
            className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-black hover:text-black"
          >
            {term}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 border-t border-neutral-200">
          {filtered.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                id={faq.id}
                ref={(el) => {
                  sectionRefs.current[faq.id] = el;
                }}
                className="scroll-mt-32 border-b border-neutral-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-lg font-medium tracking-tight text-black lg:text-xl">
                    {faq.title}
                  </span>
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
                    isOpen ? "grid-rows-[1fr] pb-7" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="space-y-4 overflow-hidden text-[15px] leading-relaxed text-neutral-600">
                    {faq.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-8 text-sm text-neutral-500">
          No encontramos nada con ese término. Escríbenos directamente con el
          formulario de contacto.
        </p>
      )}
    </div>
  );
}
