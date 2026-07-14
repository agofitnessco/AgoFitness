import { Carousel } from "components/carousel";
import CategoryShowcase from "components/category-showcase";
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
      <ProductShowcase title="Lo más nuevo" />
      <ProductShowcase title="Tendencias actuales" products={TRENDING_PRODUCTS} />
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
