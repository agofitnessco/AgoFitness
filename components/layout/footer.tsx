import Link from "next/link";
import { CATEGORY_LINKS } from "lib/constants";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "components/icons/social";
import FillButton from "components/ui/fill-button";
import FooterNewsletter from "./footer-newsletter";

const { SITE_NAME } = process.env;

const HELP_LINKS = [
  { label: "Centro de ayuda", path: "/soporte" },
  { label: "Envíos y entregas", path: "/soporte" },
  { label: "Devoluciones", path: "/soporte" },
  { label: "Guía de tallas", path: "/guia-de-tallas" },
];

const COMPANY_LINKS = [
  { label: "Nosotros", path: "/nosotros" },
  { label: "Contacto", path: "/contacto" },
  { label: "Trabaja con nosotros", path: "/contacto" },
];

const LEGAL_LINKS = [
  { label: "Privacidad", path: "/privacidad" },
  { label: "Términos", path: "/terminos" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      prefetch={true}
      className="group relative inline-block w-fit text-sm font-medium text-neutral-700 transition-colors hover:text-black"
    >
      {label}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full" />
    </Link>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    path: "https://www.instagram.com/agofitnessco/",
    Icon: InstagramIcon,
  },
  { label: "TikTok", path: "#", Icon: TikTokIcon },
  { label: "Facebook", path: "#", Icon: FacebookIcon },
];

export default async function Footer({
  hideCta = false,
}: {
  /** Oculta el CTA "Conócenos" — usar en /nosotros para no enlazar la
   * página consigo misma. */
  hideCta?: boolean;
}) {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2026 + (currentYear > 2026 ? `-${currentYear}` : "");

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white text-black">
      <div className="mx-auto flex max-w-screen-2xl flex-row items-center justify-between gap-4 px-4 py-8 lg:gap-6 lg:px-8 lg:py-16">
        <p className="min-w-0 flex-1 text-lg font-bold leading-tight tracking-tight text-black md:text-4xl">
          Feel strong. Live confident.
        </p>
        {hideCta ? null : (
          <>
            <div className="flex-none md:hidden">
              <FillButton href="/nosotros" size="sm">
                Conócenos
              </FillButton>
            </div>
            <div className="hidden flex-none md:block">
              <FillButton href="/nosotros">Conócenos</FillButton>
            </div>
          </>
        )}
      </div>

      <div className="border-t border-neutral-200">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-16 px-4 py-16 lg:px-8 md:grid-cols-[1.5fr_1.6fr]">
          <FooterNewsletter />

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Tienda
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {CATEGORY_LINKS.map((item) => (
                  <li key={item.title}>
                    <FooterLink href={item.path} label={item.title} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Ayuda
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {HELP_LINKS.map((item) => (
                  <li key={item.label}>
                    <FooterLink href={item.path} label={item.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Empresa
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {COMPANY_LINKS.map((item) => (
                  <li key={item.label}>
                    <FooterLink href={item.path} label={item.label} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1 bg-[#b48b8c]" />

      <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 py-8 lg:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="order-2 text-xs text-neutral-500 md:order-1">
            © {copyrightDate} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <div className="order-1 flex items-center gap-5 md:order-2">
            {SOCIAL_LINKS.map(({ label, path, Icon }) => (
              <a
                key={label}
                href={path}
                target={path.startsWith("http") ? "_blank" : undefined}
                rel={path.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b48b8c] hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <div className="flex items-center gap-5 text-xs font-medium text-neutral-500">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                prefetch={true}
                className="group relative inline-block w-fit transition-colors hover:text-black"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full" />
              </Link>
            ))}
          </div>

          <a
            href="https://flouvia.com"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-neutral-400 transition-colors hover:text-neutral-600"
          >
            Powered by Flouvia
          </a>
        </div>
      </div>
    </footer>
  );
}
