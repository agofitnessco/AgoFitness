import CategoryShowcase from "components/category-showcase";
// import GymcoBanner from "components/gymco-banner"; // desactivado 15 jul 2026 — ver nota en <HomePage>
import Footer from "components/layout/footer";
import Hero from "components/layout/hero";
import ProductShowcase from "components/product-showcase";
import { ELEMENT_PRODUCTS } from "lib/product-showcase-data";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";

const { SITE_NAME } = process.env;

const title = "Ago Fitness — Activewear y Ropa Deportiva para Mujer y Hombre";
const description =
  "Activewear para mujer y hombre en México: leggings, tops, shorts, chamarras y conjuntos de la colección Element. Rendimiento real, sin sacrificar estilo.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "activewear",
    "ropa deportiva",
    "leggings mujer",
    "ropa para entrenar",
    "ropa deportiva hombre",
    "Ago Fitness",
  ],
  alternates: {
    canonical: "/",
  },
  // Sin `images` explícitas: el home ya tiene su propia
  // app/opengraph-image.tsx (1200×630, wordmark + nombre sobre fondo negro)
  // — declarar `images` aquí la pisaría por una captura plana del logo.
  openGraph: {
    title,
    description,
    url: baseUrl,
    siteName: SITE_NAME,
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// Misma línea Element, curada en otro orden — piezas premium primero.
const TRENDING_ORDER = [
  "Element Dynamic Legging",
  "Element Performance Jacket",
  "Element Alpha Soft",
  "Element Force Soft",
  "Element Top",
  "Element Nova Falda",
  "Element Lume Biker",
  "Element Motion Top",
];
const TRENDING_PRODUCTS = TRENDING_ORDER.map(
  (title) => ELEMENT_PRODUCTS.find((product) => product.title === title)!,
);

// JSON-LD: entidad de marca + búsqueda del sitio + catálogo destacado en el
// home, para rich results y extracción por AI Overviews/LLMs. El detalle de
// cada producto (precio, disponibilidad) ya vive en su propio schema
// `Product` en /product/[handle] — aquí solo enlazamos, sin duplicar precios
// que puedan desactualizarse.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}/#organization`,
  name: SITE_NAME,
  url: baseUrl,
  logo: `${baseUrl}/imgs/logo-ago.png`,
  sameAs: ["https://www.instagram.com/agofitnessco/"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  url: baseUrl,
  name: SITE_NAME,
  inLanguage: "es-MX",
  publisher: { "@id": `${baseUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${baseUrl}/#lo-mas-nuevo`,
  name: "Lo más nuevo — Ago Fitness",
  itemListElement: TRENDING_PRODUCTS.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${baseUrl}/product/${product.handle}`,
    name: product.title,
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationJsonLd,
            websiteJsonLd,
            itemListJsonLd,
          ]),
        }}
      />
      <Hero />
      <CategoryShowcase />
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-10 lg:px-8 lg:py-14">
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-700 lg:text-xl">
          <strong className="font-bold text-black">Ago Fitness</strong> es una
          marca de activewear para mujer y hombre en México. Leggings, tops,
          shorts, chamarras y conjuntos de la colección Element, diseñados
          para moverse contigo — rendimiento real, sin sacrificar estilo.
        </p>
      </section>
      <ProductShowcase id="nueva-coleccion" title="Lo más nuevo" />
      {/* GymcoBanner desactivado a pedido del cliente (15 jul 2026) — componente
          intacto en components/gymco-banner.tsx, solo descomentar el import de
          arriba + esta línea para reactivarlo. Ver docs/decisiones.md. */}
      <ProductShowcase title="Tendencias actuales" products={TRENDING_PRODUCTS} />
      <Footer />
    </>
  );
}
