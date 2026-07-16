import { Carousel } from "components/carousel";
import CategoryShowcase from "components/category-showcase";
// import GymcoBanner from "components/gymco-banner"; // desactivado 15 jul 2026 — ver nota en <HomePage>
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";
import Hero from "components/layout/hero";
import ProductShowcase from "components/product-showcase";
import { ELEMENT_PRODUCTS } from "lib/product-showcase-data";

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
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

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <ProductShowcase id="nueva-coleccion" title="Lo más nuevo" />
      {/* GymcoBanner desactivado a pedido del cliente (15 jul 2026) — componente
          intacto en components/gymco-banner.tsx, solo descomentar el import de
          arriba + esta línea para reactivarlo. Ver docs/decisiones.md. */}
      <ProductShowcase title="Tendencias actuales" products={TRENDING_PRODUCTS} />
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
