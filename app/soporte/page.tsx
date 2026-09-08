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
      "Inicia sesión en tu cuenta para ver el historial de tus pedidos. Enviamos por DHL a toda la República Mexicana ($150 MXN): tu pedido se procesa y despacha en 24–48 horas hábiles, y la entrega estimada de DHL es de 1 a 3 días hábiles en zonas urbanas principales y hasta 5 días hábiles en el resto del país. El tracking en vivo por paquetería está pendiente de conectar.",
  },
  {
    question: "¿Quieres cambiar de talla o hacer una devolución?",
    answer:
      "Si tu pedido llega con un defecto o quieres cambiarlo por otra talla, escríbenos con el formulario de contacto o a hola@agofitness.com. Aceptamos cambios y devoluciones dentro de los 15 días naturales posteriores a la entrega, con la prenda sin usar y etiqueta original — revisa el detalle en Términos y Condiciones.",
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
