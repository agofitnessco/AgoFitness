import type { Metadata } from "next";

import Footer from "components/layout/footer";
import SizeGuide from "components/size-guide";

export const metadata: Metadata = {
  title: "Guía de tallas",
  description:
    "Encuentra tu talla ideal en Ago Fitness — tabla de medidas en centímetros para mujer y hombre.",
};

export default function GuiaDeTallasPage() {
  return (
    <>
      <SizeGuide />
      <Footer />
    </>
  );
}
