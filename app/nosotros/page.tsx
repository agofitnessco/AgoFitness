import type { Metadata } from "next";

import AboutCta from "components/about/about-cta";
import AboutHero from "components/about/about-hero";
import AboutPillars from "components/about/about-pillars";
import AboutStory from "components/about/about-story";
import Footer from "components/layout/footer";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce Ago Fitness: activewear diseñado para moverse contigo. Nuestra historia, el producto que hacemos y la comunidad que construimos.",
};

export default function NosotrosPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutPillars />
      <AboutCta />
      <Footer hideCta />
    </>
  );
}
