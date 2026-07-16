import type { Metadata } from "next";

import ContactFaq from "components/contact-faq";
import ContactForm from "components/contact-form";
import Footer from "components/layout/footer";

export const metadata: Metadata = {
  title: "Contáctanos",
  description:
    "Envíanos tus preguntas sobre pedidos, tallas, devoluciones o cualquier otra cosa — Ago Fitness te responde en menos de 24 horas.",
};

export default function ContactoPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-screen-lg px-4 py-20 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-black lg:text-5xl">
          Contáctanos
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-600">
          ¿Tienes alguna pregunta sobre tallas, devoluciones o cualquier otra
          cosa? Rellena el formulario a continuación: estaremos encantados de
          hablar contigo.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">
              Formulario de contacto
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <ContactFaq />
        </div>
      </section>
      <Footer />
    </>
  );
}
