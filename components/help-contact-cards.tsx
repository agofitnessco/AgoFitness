import { EnvelopeIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { InstagramIcon } from "components/icons/social";
import Link from "next/link";

const CHANNELS = [
  {
    label: "Correo electrónico",
    Icon: EnvelopeIcon,
    desc: "Escríbenos cuando quieras — te respondemos a tu correo en menos de 24 horas.",
    cta: "Escribir correo",
    href: "mailto:hola@agofitness.com",
    external: false,
  },
  {
    label: "Formulario de contacto",
    Icon: ChatBubbleLeftRightIcon,
    desc: "Cuéntanos el motivo de tu consulta y te contactamos por correo.",
    cta: "Ir al formulario",
    href: "/contacto",
    external: false,
  },
  {
    label: "Instagram",
    Icon: InstagramIcon,
    desc: "Escríbenos por mensaje directo a @agofitnessco.",
    cta: "Enviar mensaje",
    href: "https://www.instagram.com/agofitnessco/",
    external: true,
  },
];

export default function HelpContactCards() {
  return (
    <div className="mt-16 border-t border-neutral-200 pt-16">
      <h2 className="text-xl font-bold tracking-tight text-black lg:text-2xl">
        ¿No encontraste tu respuesta? Ponte en contacto con nosotros.
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CHANNELS.map(({ label, Icon, desc, cta, href, external }) => (
          <div
            key={label}
            className="flex flex-col rounded-xl bg-neutral-50 p-6"
          >
            <Icon className="h-6 w-6 text-black" />
            <p className="mt-4 font-bold text-black">{label}</p>
            <p className="mt-2 flex-1 text-sm text-neutral-600">{desc}</p>
            <Link
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="mt-5 inline-flex w-fit items-center rounded-lg bg-black px-4 py-2 text-xs font-bold tracking-wide text-white uppercase transition-opacity hover:opacity-80"
            >
              {cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
