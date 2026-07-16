import type { Metadata } from "next";

import Footer from "components/layout/footer";
import { LegalAccordion, type LegalSection } from "components/legal-accordion";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de privacidad de Ago Fitness — qué datos personales recabamos, para qué los usamos y cómo ejercer tus derechos ARCO.",
};

function Pending({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-4 text-sm text-neutral-600">
      <span className="font-semibold text-black">Pendiente: </span>
      {children}
    </div>
  );
}

const SECTIONS: LegalSection[] = [
  {
    title: "Identidad del responsable",
    body: (
      <>
        <p>
          Ago Fitness (&quot;nosotros&quot;), a través del sitio
          agofitness.com, es responsable del tratamiento de tus datos
          personales conforme a la Ley Federal de Protección de Datos
          Personales en Posesión de los Particulares (LFPDPPP) de México.
        </p>
        <Pending>
          la razón social y el domicilio fiscal exactos del responsable — se
          agregarán a este aviso en cuanto estén definidos.
        </Pending>
      </>
    ),
  },
  {
    title: "Datos personales que recabamos",
    body: (
      <>
        <p>Dependiendo de cómo interactúes con el Sitio, podemos recabar:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-black">
              Datos de identificación y contacto:
            </span>{" "}
            nombre, correo electrónico y teléfono, al crear una cuenta,
            hacer un pedido o suscribirte al newsletter.
          </li>
          <li>
            <span className="font-medium text-black">
              Datos de envío y facturación:
            </span>{" "}
            direcciones que guardas en tu cuenta o capturas al pagar.
          </li>
          <li>
            <span className="font-medium text-black">
              Historial de pedidos:
            </span>{" "}
            productos comprados, tallas y montos, visibles en{" "}
            <span className="font-medium text-black">/cuenta</span>.
          </li>
          <li>
            <span className="font-medium text-black">
              Preferencias del navegador:
            </span>{" "}
            tus favoritos y productos vistos recientemente se guardan solo
            en tu propio dispositivo (no en nuestros servidores).
          </li>
        </ul>
        <p>
          No te pedimos ni almacenamos el número completo de tu tarjeta de
          pago — eso lo procesa directamente la pasarela de pago del
          checkout.
        </p>
      </>
    ),
  },
  {
    title: "Finalidades del tratamiento",
    body: (
      <>
        <p>
          <span className="font-medium text-black">
            Finalidades primarias
          </span>{" "}
          (necesarias para atenderte): procesar tu pedido y pago, coordinar
          el envío, darte soporte, administrar tu cuenta y cumplir con
          obligaciones legales y fiscales.
        </p>
        <p>
          <span className="font-medium text-black">
            Finalidades secundarias
          </span>{" "}
          (opcionales): enviarte novedades y promociones por correo si te
          suscribes al newsletter. Puedes darte de baja en cualquier
          momento desde el propio correo o escribiéndonos.
        </p>
      </>
    ),
  },
  {
    title: "Transferencia de datos a terceros",
    body: (
      <>
        <p>
          Para operar la tienda, compartimos los datos estrictamente
          necesarios con:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-black">Shopify Inc.</span>,
            que aloja el catálogo, procesa el checkout y almacena los datos
            de tu cuenta y pedidos como nuestro encargado de tratamiento.
          </li>
          <li>La pasarela de pago habilitada en el checkout.</li>
          <li>
            La paquetería encargada de entregar tu pedido, únicamente con
            los datos de contacto y dirección necesarios para la entrega.
          </li>
        </ul>
        <p>No vendemos tus datos personales a terceros.</p>
      </>
    ),
  },
  {
    title: "Uso de cookies",
    body: (
      <p>
        El Sitio usa cookies propias y de Shopify para mantener tu sesión y
        tu carrito de compra activos mientras navegas. Puedes configurar tu
        navegador para rechazar cookies, aunque esto puede afectar el
        funcionamiento del carrito y el checkout.
      </p>
    ),
  },
  {
    title: "Derechos ARCO",
    body: (
      <p>
        Tienes derecho a Acceder, Rectificar y Cancelar tus datos
        personales, así como a Oponerte a su uso para fines específicos
        (derechos ARCO). Puedes ejercerlos directamente editando tu perfil
        y direcciones en{" "}
        <span className="font-medium text-black">/cuenta</span>, o
        escribiéndonos por correo — responderemos tu solicitud en un plazo
        razonable.
      </p>
    ),
  },
  {
    title: "Cambios a este aviso",
    body: (
      <p>
        Podemos actualizar este aviso de privacidad ocasionalmente. La
        fecha de &quot;última actualización&quot; al inicio de este
        documento siempre indicará la versión vigente.
      </p>
    ),
  },
  {
    title: "Contacto",
    body: (
      <p>
        Para cualquier duda o solicitud sobre tus datos personales,
        escríbenos a{" "}
        <a href="mailto:hola@agofitness.com" className="underline">
          hola@agofitness.com
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-screen-lg px-4 py-20 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-black lg:text-5xl">
          Aviso de Privacidad
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-600">
          En Ago Fitness cuidamos tus datos personales con la misma
          seriedad con la que cuidamos cada prenda que enviamos. Este aviso
          explica qué datos recabamos, para qué los usamos y cómo puedes
          controlarlos.
        </p>
        <p className="mt-4 text-sm italic text-neutral-500">
          Última actualización: 16 de julio de 2026.
        </p>

        <LegalAccordion sections={SECTIONS} />
      </section>
      <Footer />
    </>
  );
}
