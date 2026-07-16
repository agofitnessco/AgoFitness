import type { Metadata } from "next";

import Footer from "components/layout/footer";
import SizeGuide from "components/size-guide";

export const metadata: Metadata = {
  title: "Guía de tallas",
  description:
    "Encuentra tu talla ideal en Ago Fitness — tabla de medidas en centímetros para mujer y hombre.",
  alternates: {
    canonical: "/guia-de-tallas",
  },
  openGraph: {
    title: "Guía de tallas",
    description:
      "Encuentra tu talla ideal en Ago Fitness — tabla de medidas en centímetros para mujer y hombre.",
    url: "/guia-de-tallas",
    type: "website",
  },
};

export default function GuiaDeTallasPage() {
  return (
    <>
      <SizeGuide />
      <Footer />
    </>
  );
}
