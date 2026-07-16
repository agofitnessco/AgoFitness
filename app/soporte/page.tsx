import type { Metadata } from "next";

import Footer from "components/layout/footer";
import HelpCenter from "components/help-center";
import HelpContactCards from "components/help-contact-cards";

export const metadata: Metadata = {
  title: "Centro de ayuda",
  description:
    "Resuelve tus dudas sobre pedidos, envíos, tallas, pagos y devoluciones en Ago Fitness — o ponte en contacto directo con nosotros.",
};

export default function SoportePage() {
  return (
    <>
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
