import { ArrowsRightLeftIcon, SunIcon } from "@heroicons/react/24/outline";
import Footer from "components/layout/footer";
import { FeatureStory } from "components/product/feature-story";
import { Gallery } from "components/product/gallery";
import { InfoBadge } from "components/product/info-badge";
import { OutfitGrid } from "components/product/outfit-grid";
import {
  breadcrumbFor,
  ProductDescription,
} from "components/product/product-description";
import { ProductInfoAccordion } from "components/product/product-info-accordion";
import RecordRecentlyViewed from "components/product/record-recently-viewed";
import { RecommendationsCarousel } from "components/product/recommendations-carousel";
import { colorHex } from "lib/color-placeholder";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { climateFor, fitFor, sameGender } from "lib/product-types";
import { getProduct, getProductRecommendations, getProducts } from "lib/shopify";
import type { Image } from "lib/shopify/types";
import { baseUrl } from "lib/utils";
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const colorOption = product.options.find(
    (option) => option.name.toLowerCase() === "color",
  );
  const colorSwatches = colorOption?.values.map((value) => ({
    name: value,
    hex: colorHex(value),
  }));

  // Fotos reales suben etiquetadas por color en el altText (ej. "Top Diamond
  // Cross Cielo") — sin eso, un producto con varios colores mezclaría las
  // fotos de todos los colores en una sola galería. Si el color activo no
  // tiene fotos con match (línea Element, sin fotografía real todavía),
  // cae a la lista completa sin filtrar.
  const activeColorName =
    (typeof searchParams.color === "string" ? searchParams.color : null) ??
    colorSwatches?.[0]?.name;
  const colorFilteredImages = activeColorName
    ? product.images.filter((image) =>
        image.altText?.toLowerCase().includes(activeColorName.toLowerCase()),
      )
    : [];
  const galleryImages =
    colorFilteredImages.length > 0 ? colorFilteredImages : product.images;

  const recommendations = await getProductRecommendations(product.id);

  // Segmentación por género: una prenda de Mujer nunca debe recomendar
  // algo de Hombre y viceversa, en NINGUNA superficie de la página (ni el
  // carrusel de abajo, que por lo demás no se filtra por tipo — ver
  // `sameGender` en lib/product-types.ts). Se aplica antes que cualquier
  // otro filtro.
  const genderMatchedRecommendations = recommendations.filter((candidate) =>
    sameGender(candidate.tags, product.tags),
  );

  // "Queda bien con..." e "Ideas para combinar" son piezas sueltas para
  // armar un outfit con la prenda actual — un conjunto o enterizo ya es
  // un outfit completo, no tiene sentido "combinarlo". El carrusel
  // completo de abajo (RecommendationsCarousel) SÍ muestra todo tipo de
  // prenda, sin este filtro — usa `genderMatchedRecommendations` sin
  // tocar, no esta lista. Los Enterizo de Kisu están tipados como
  // "Conjunto" en Shopify (no tienen su propio productType), así que el
  // filtro también revisa el título.
  const isOutfitPiece = (candidate: { productType: string; title: string }) => {
    const type = candidate.productType.toLowerCase();
    const title = candidate.title.toLowerCase();
    return type !== "conjunto" && !title.includes("enterizo");
  };
  let outfitOnlyRecommendations = genderMatchedRecommendations.filter(
    isOutfitPiece,
  );

  // Las recomendaciones de Shopify son una lista corta y fija — filtrar
  // por género y luego por tipo ahí puede dejar muy pocas piezas y
  // espacios vacíos en la última fila del grid, o un carrusel de abajo
  // corto. Se apunta a un mínimo por sección y se rellena con más
  // productos reales del catálogo (best-sellers, del mismo género, sin
  // repetir lo que ya está ni mostrar la prenda actual) si hace falta.
  const OUTFIT_TARGET = 7; // 1 para "Queda bien con..." + 6 para "Ideas para combinar" (múltiplo de 3)
  const BOTTOM_TARGET = 8;
  const needsCatalog =
    outfitOnlyRecommendations.length < OUTFIT_TARGET ||
    genderMatchedRecommendations.length < BOTTOM_TARGET;
  const catalog = needsCatalog
    ? await getProducts({ sortKey: "BEST_SELLING" })
    : [];
  const sameGenderCatalog = catalog.filter((p) =>
    sameGender(p.tags, product.tags),
  );

  if (outfitOnlyRecommendations.length < OUTFIT_TARGET) {
    const usedHandles = new Set([
      product.handle,
      ...outfitOnlyRecommendations.map((p) => p.handle),
    ]);
    const fillers = sameGenderCatalog
      .filter(isOutfitPiece)
      .filter((p) => !usedHandles.has(p.handle));
    outfitOnlyRecommendations = [
      ...outfitOnlyRecommendations,
      ...fillers.slice(0, OUTFIT_TARGET - outfitOnlyRecommendations.length),
    ];
  }

  const completeWith = outfitOnlyRecommendations[0];
  const otherRecommendations = outfitOnlyRecommendations.filter(
    (product) => product.handle !== completeWith?.handle,
  );

  // Carrusel de abajo ("Creemos que también te gustará...") — mismo
  // respaldo del catálogo si Shopify no trae suficientes del mismo
  // género, pero sin filtrar por tipo de prenda (conjuntos/enterizos sí
  // aparecen aquí, a propósito).
  let bottomRecommendations = genderMatchedRecommendations;
  if (bottomRecommendations.length < BOTTOM_TARGET) {
    const usedHandles = new Set([
      product.handle,
      ...bottomRecommendations.map((p) => p.handle),
    ]);
    const fillers = sameGenderCatalog.filter(
      (p) => !usedHandles.has(p.handle),
    );
    bottomRecommendations = [
      ...bottomRecommendations,
      ...fillers.slice(0, BOTTOM_TARGET - bottomRecommendations.length),
    ];
  }

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

  // Mismo breadcrumb que ya se ve arriba del <h1> (ProductDescription) —
  // se calcula una sola vez con `breadcrumbFor` para que el schema nunca
  // se desincronice de lo que el usuario ve.
  const { gender, typeEntry } = breadcrumbFor(product);
  const breadcrumbItems = [
    { name: "Comprar", url: `${baseUrl}/search` },
    ...(gender ? [{ name: gender.title, url: `${baseUrl}${gender.path}` }] : []),
    ...(typeEntry
      ? [{ name: typeEntry.label, url: `${baseUrl}${typeEntry.path}` }]
      : []),
    { name: product.title, url: `${baseUrl}/product/${product.handle}` },
  ];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]),
        }}
      />
      <RecordRecentlyViewed product={product} />
      <div className="w-full px-4 pt-8 lg:px-8 lg:pt-12">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
          <div className="w-full lg:col-start-1 lg:row-start-1">
            <Suspense
              fallback={
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-100 lg:aspect-[16/10]" />
              }
            >
              <Gallery
                images={galleryImages.slice(0, 7).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
                colorSwatches={colorSwatches}
              />
            </Suspense>
          </div>

          <div className="w-full lg:col-start-2 lg:row-start-1 lg:pt-4">
            <Suspense fallback={null}>
              <ProductDescription product={product} completeWith={completeWith} />
            </Suspense>
          </div>

          <div className="w-full lg:col-start-1 lg:row-start-2">
            <ProductInfoAccordion product={product} />
          </div>

          <div className="w-full lg:col-start-2 lg:row-start-2">
            <FitClimateRow productType={product.productType} title={product.title} />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
        <OutfitGrid heroProduct={product} pieces={otherRecommendations} />
        <FeatureStory product={product} />
      </div>
      <RecommendationsCarousel products={bottomRecommendations} />
      <Footer />
    </>
  );
}

function FitClimateRow({
  productType,
  title,
}: {
  productType: string;
  title: string;
}) {
  const estimateNote =
    "Esta clasificación es una estimación por tipo de prenda, no una medición individual de esta pieza.";

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-1 lg:gap-3">
      <div className="flex items-center gap-3 lg:rounded-lg lg:border lg:border-neutral-200 lg:p-4">
        <ArrowsRightLeftIcon className="h-6 w-6 flex-none text-neutral-400" />
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-neutral-500 uppercase">
            Ajuste{" "}
            <InfoBadge align="left">
              <p>Ajustado: se ciñe al cuerpo.</p>
              <p className="mt-2">Holgado: corte amplio y cómodo.</p>
              <p className="mt-2">Estándar: ni ceñido ni amplio.</p>
              <p className="mt-4 text-xs text-white/60">{estimateNote}</p>
            </InfoBadge>
          </p>
          <p className="text-xl font-bold text-black">
            {fitFor(productType, title)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 lg:rounded-lg lg:border lg:border-neutral-200 lg:p-4">
        <SunIcon className="h-6 w-6 flex-none text-neutral-400" />
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-neutral-500 uppercase">
            Clima{" "}
            <InfoBadge align="right">
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
