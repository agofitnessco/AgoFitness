import type { Metadata } from "next";

import Footer from "components/layout/footer";
import { LegalAccordion, type LegalSection } from "components/legal-accordion";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones de uso y compra de Ago Fitness — catálogo, precios, envíos, cambios y devoluciones.",
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
    title: "Aceptación de estos Términos",
    body: (
      <>
        <p>
          Este documento aplica a cualquier persona que navegue, cree una
          cuenta o compre en agofitness.com (el &quot;Sitio&quot;), operado
          por Ago Fitness. Si no estás de acuerdo con estos términos, te
          pedimos no usar el Sitio.
        </p>
        <Pending>
          la razón social y el domicilio fiscal exactos de la entidad legal
          que opera Ago Fitness — se agregarán a este documento en cuanto
          estén definidos.
        </Pending>
      </>
    ),
  },
  {
    title: "Objeto del sitio",
    body: (
      <p>
        El Sitio es una tienda en línea de ropa deportiva y de uso diario
        (activewear) para mujer y hombre. El catálogo, los precios y el
        proceso de compra se operan sobre la plataforma de Shopify.
      </p>
    ),
  },
  {
    title: "Cuentas de cliente",
    body: (
      <p>
        Puedes comprar como invitado o crear una cuenta en{" "}
        <span className="font-medium text-black">/cuenta</span> para guardar
        tus datos de contacto, direcciones de envío e historial de pedidos.
        Eres responsable de mantener la confidencialidad de tu contraseña y
        de toda actividad realizada desde tu cuenta.
      </p>
    ),
  },
  {
    title: "Productos, precios y disponibilidad",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Los precios se muestran en pesos mexicanos (MXN) e incluyen los
          impuestos aplicables salvo que se indique lo contrario.
        </li>
        <li>
          Hacemos lo posible por mostrar el color y la textura reales de
          cada prenda, pero pueden existir variaciones menores por pantalla
          o iluminación.
        </li>
        <li>
          Si un producto se agota o su precio cambia después de haberlo
          agregado al carrito pero antes de completar el pago, te
          avisaremos antes de cobrar cualquier monto.
        </li>
      </ul>
    ),
  },
  {
    title: "Pago",
    body: (
      <p>
        El pago se procesa a través de los métodos habilitados en el
        checkout de Shopify al momento de tu compra. No almacenamos los
        datos completos de tu tarjeta — esa información la procesa
        directamente la pasarela de pago.
      </p>
    ),
  },
  {
    title: "Envíos y entregas",
    body: (
      <>
        <p>
          Enviamos a las direcciones disponibles en el checkout. Los
          tiempos de entrega estimados se muestran durante el proceso de
          compra y pueden variar según destino y disponibilidad de la
          paquetería.
        </p>
        <Pending>
          la paquetería específica con la que trabajamos y la tabla
          detallada de tiempos/costos de envío por zona — se publicará aquí
          y en el centro de ayuda en cuanto esté confirmada con el cliente.
        </Pending>
      </>
    ),
  },
  {
    title: "Cambios y devoluciones",
    body: (
      <>
        <p>
          Si tu pedido llega con un defecto o no corresponde a lo que
          ordenaste, contáctanos por correo y te ayudamos a resolverlo sin
          costo para ti.
        </p>
        <Pending>
          la política completa de cambios y devoluciones por talla o
          preferencia (plazos exactos, condición de la prenda, quién cubre
          el costo de envío de regreso) — se publicará aquí en cuanto el
          cliente la defina.
        </Pending>
      </>
    ),
  },
  {
    title: "Propiedad intelectual",
    body: (
      <p>
        El nombre Ago Fitness, el logotipo, las fotografías, los textos y
        el diseño del Sitio son propiedad de Ago Fitness o de sus
        licenciantes. No está permitido reproducirlos, distribuirlos o
        usarlos comercialmente sin autorización previa por escrito.
      </p>
    ),
  },
  {
    title: "Uso aceptable del sitio",
    body: (
      <p>
        Te pedimos no usar el Sitio para fines ilícitos, no intentar
        vulnerar su seguridad, no extraer su contenido de forma
        automatizada (scraping) sin permiso, y no hacerte pasar por otra
        persona al crear una cuenta o realizar un pedido.
      </p>
    ),
  },
  {
    title: "Limitación de responsabilidad",
    body: (
      <p>
        Hacemos nuestro mejor esfuerzo para que el Sitio funcione sin
        interrupciones y que la información del catálogo sea precisa, pero
        no garantizamos que esté libre de errores en todo momento. En la
        medida permitida por la ley, Ago Fitness no será responsable por
        daños indirectos derivados del uso del Sitio.
      </p>
    ),
  },
  {
    title: "Modificaciones a estos Términos",
    body: (
      <p>
        Podemos actualizar estos Términos ocasionalmente para reflejar
        cambios en nuestras operaciones o en la ley aplicable. La fecha de
        &quot;última actualización&quot; al inicio de este documento
        siempre indicará la versión vigente.
      </p>
    ),
  },
  {
    title: "Legislación aplicable y jurisdicción",
    body: (
      <p>
        Estos Términos se rigen por las leyes de los Estados Unidos
        Mexicanos. Cualquier controversia se resolverá ante los tribunales
        competentes de México, salvo que la ley aplicable disponga algo
        distinto para consumidores.
      </p>
    ),
  },
  {
    title: "Contacto",
    body: (
      <p>
        ¿Dudas sobre estos Términos? Escríbenos a{" "}
        <a href="mailto:hola@agofitness.com" className="underline">
          hola@agofitness.com
        </a>
        .
      </p>
    ),
  },
];

export default function TerminosPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-screen-lg px-4 py-20 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-black lg:text-5xl">
          Términos y Condiciones
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-600">
          Estos son los términos que rigen el uso de este sitio y la compra de
          nuestros productos. Al usar agofitness.com o realizar un pedido,
          aceptas lo descrito aquí.
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
