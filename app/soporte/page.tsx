import type { Metadata } from "next";

import Footer from "components/layout/footer";
import HelpCenter from "components/help-center";
import HelpContactCards from "components/help-contact-cards";

export const metadata: Metadata = {
  title: "Centro de ayuda",
  description:
    "Resuelve tus dudas sobre pedidos, envíos, tallas, pagos y devoluciones en Ago Fitness — o ponte en contacto directo con nosotros.",
  alternates: {
    canonical: "/soporte",
  },
  openGraph: {
    title: "Centro de ayuda",
    description:
      "Resuelve tus dudas sobre pedidos, envíos, tallas, pagos y devoluciones en Ago Fitness — o ponte en contacto directo con nosotros.",
    url: "/soporte",
    type: "website",
  },
};

// Mismo contenido que ya se muestra en el acordeón de HelpCenter (mismos IDs:
// pedidos/cambios/tallas/pagos/cuenta) — reescrito a texto plano para el
// schema FAQPage (Google requiere que el contenido de la schema sea visible
// en la página, no lo pisa ni lo duplica, solo lo espeja). Si el copy del
// acordeón cambia, actualizar aquí también.
const FAQ_JSON_LD_ITEMS = [
  {
    question: "¿Quieres saber el estado de tu pedido o el tiempo de envío?",
    answer:
      "Inicia sesión en tu cuenta para ver el historial de tus pedidos. México es nuestro mercado principal: la paquetería y los tiempos de entrega exactos por zona todavía están en definición y se publicarán en cuanto estén confirmados. El tracking en vivo por paquetería también está pendiente de conectar.",
  },
  {
    question: "¿Quieres cambiar de talla o hacer una devolución?",
    answer:
      "Si tu pedido llega con un defecto o quieres cambiarlo por otra talla, escríbenos con el formulario de contacto o a hola@agofitness.com. La política completa de cambios y devoluciones sigue en definición — puedes ver lo confirmado hasta ahora en Términos y Condiciones.",
  },
  {
    question: "¿Quieres más información sobre nuestras tallas?",
    answer:
      "Revisa nuestra guía de tallas, con medidas reales en centímetros por prenda. Si sigues con dudas sobre qué talla pedir, escríbenos con el formulario de esta página.",
  },
  {
    question: "¿Tienes dudas sobre un cargo o cómo pagar?",
    answer:
      "El pago se procesa de forma segura en el checkout de Shopify, en pesos mexicanos (MXN). No almacenamos el número completo de tu tarjeta — eso lo procesa directamente la pasarela de pago. Si tienes un cargo duplicado o incorrecto, escríbenos de inmediato con el formulario de contacto.",
  },
  {
    question: "¿Necesitas editar tu perfil o direcciones?",
    answer:
      "Desde tu cuenta puedes editar tu perfil, tus direcciones guardadas y recuperar tu contraseña si la olvidaste.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_JSON_LD_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function SoportePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="mx-auto w-full max-w-screen-lg px-4 py-20 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-black lg:text-5xl">
          Centro de ayuda
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-600">
          Encuentra respuesta a lo que necesites sobre tu pedido, tu talla o
          tu cuenta. Si no la encuentras aquí, estamos a un mensaje de
          distancia.
        </p>

        <div className="mt-16">
          <HelpCenter />
        </div>

        <HelpContactCards />
      </section>
      <Footer />
    </>
  );
}
