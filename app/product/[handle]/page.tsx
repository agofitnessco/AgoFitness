import { ArrowsRightLeftIcon, SunIcon } from "@heroicons/react/24/outline";
import Footer from "components/layout/footer";
import { FeatureStory } from "components/product/feature-story";
import { Gallery } from "components/product/gallery";
import { InfoBadge } from "components/product/info-badge";
import { OutfitGrid } from "components/product/outfit-grid";
import { ProductDescription } from "components/product/product-description";
import { ProductInfoAccordion } from "components/product/product-info-accordion";
import RecordRecentlyViewed from "components/product/record-recently-viewed";
import { RecommendationsCarousel } from "components/product/recommendations-carousel";
import { colorHex } from "lib/color-placeholder";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { climateFor, fitFor } from "lib/product-types";
import { getProduct, getProductRecommendations } from "lib/shopify";
import type { Image } from "lib/shopify/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const colorOption = product.options.find(
    (option) => option.name.toLowerCase() === "color",
  );
  const colorSwatches = colorOption?.values.map((value) => ({
    name: value,
    hex: colorHex(value),
  }));

  const recommendations = await getProductRecommendations(product.id);
  const completeWith = recommendations[0];
  const otherRecommendations = recommendations.slice(1);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url || "/imgs/logo-ago.png",
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <RecordRecentlyViewed product={product} />
      <div className="w-full px-4 py-8 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
          <div className="w-full">
            <Suspense
              fallback={
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-100" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
                colorSwatches={colorSwatches}
              />
            </Suspense>
            <ProductInfoAccordion />
          </div>

          <div className="w-full lg:pt-4">
            <Suspense fallback={null}>
              <ProductDescription product={product} completeWith={completeWith} />
            </Suspense>
          </div>
        </div>
        <FitClimateRow productType={product.productType} />
      </div>
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
        <OutfitGrid heroProduct={product} pieces={otherRecommendations} />
        <FeatureStory product={product} />
      </div>
      <RecommendationsCarousel products={recommendations} />
      <Footer />
    </>
  );
}

function FitClimateRow({ productType }: { productType: string }) {
  const estimateNote =
    "Esta clasificación es una estimación por tipo de prenda, no una medición individual de esta pieza.";

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 border-t border-neutral-200 pt-8 sm:grid-cols-2">
      <div className="flex items-center gap-3">
        <ArrowsRightLeftIcon className="h-6 w-6 flex-none text-neutral-400" />
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-neutral-500 uppercase">
            Ajuste{" "}
            <InfoBadge>
              <p>Ajustado: se ciñe al cuerpo.</p>
              <p className="mt-2">Holgado: corte amplio y cómodo.</p>
              <p className="mt-2">Estándar: ni ceñido ni amplio.</p>
              <p className="mt-4 text-xs text-white/60">{estimateNote}</p>
            </InfoBadge>
          </p>
          <p className="text-xl font-bold text-black">
            {fitFor(productType)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SunIcon className="h-6 w-6 flex-none text-neutral-400" />
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-neutral-500 uppercase">
            Clima{" "}
            <InfoBadge>
              <p>Cálido: pensada para clima templado-caluroso.</p>
              <p className="mt-2">Frío: pensada para clima frío.</p>
              <p className="mt-2">Templado: temperaturas intermedias.</p>
              <p className="mt-2">Todo el año: funciona en cualquier clima.</p>
              <p className="mt-4 text-xs text-white/60">{estimateNote}</p>
            </InfoBadge>
          </p>
          <p className="text-xl font-bold text-black">
            {climateFor(productType)}
          </p>
        </div>
      </div>
    </div>
  );
}
