import { getCollection, getCollectionProducts } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import CollectionHeader, {
  type CollectionTab,
} from "components/collection/collection-header";
import FilterBar from "components/collection/filter-bar";
import ProductCard from "components/collection/product-card";
import { defaultSort, MEGA_MENU, sorting } from "lib/constants";
import { typeLabel } from "lib/product-types";
import { Product } from "lib/shopify/types";

/** Handles raíz (género) que sí muestran las pills de subcategoría del mega menu. */
const GENDER_BY_HANDLE: Record<string, keyof typeof MEGA_MENU> = {
  mujer: "Mujer",
  hombre: "Hombre",
  ninos: "Niños",
};

function tabsFor(handle: string): CollectionTab[] | undefined {
  const gender = GENDER_BY_HANDLE[handle];
  if (!gender) return undefined;

  const siblings = MEGA_MENU[gender]!.primaryLinks.filter(
    (link) => link.label !== "Ver todo",
  );

  return [
    { label: "Todos", path: `/search/${handle}` },
    ...siblings.map((link) => ({ label: link.label, path: link.path })),
  ];
}

const HANDLE_BY_GENDER: Record<keyof typeof MEGA_MENU, string> = {
  Mujer: "mujer",
  Hombre: "hombre",
  Niños: "ninos",
};

/**
 * Para el JSON-LD `BreadcrumbList`: si `handle` es una raíz de género
 * (mujer/hombre/ninos) no tiene padre. Si es una subcategoría (leggings,
 * chamarras...), se busca a qué género pertenece recorriendo los
 * `primaryLinks` reales de `MEGA_MENU` — misma fuente de verdad que ya
 * arma el mega menu, no se inventa una jerarquía nueva.
 */
function parentGenderFor(handle: string) {
  if (GENDER_BY_HANDLE[handle]) return undefined;

  const genderKey = (Object.keys(MEGA_MENU) as (keyof typeof MEGA_MENU)[]).find(
    (key) => MEGA_MENU[key]!.primaryLinks.some((link) => link.path === `/search/${handle}`),
  );
  if (!genderKey) return undefined;

  return { title: genderKey, path: `/search/${HANDLE_BY_GENDER[genderKey]}` };
}

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  const title = collection.seo?.title || collection.title;
  // Fallback en español: la mayoría de las colecciones (todas menos Mujer/
  // Hombre) no tienen `description` capturada en el Admin de Shopify — sin
  // este fallback, esas páginas caían a un genérico en inglés
  // ("Leggings products") en un sitio 100% en español. Ver docs/decisiones.md.
  const description =
    collection.seo?.description ||
    collection.description ||
    `Compra ${collection.title} en Ago Fitness — activewear diseñado para moverse contigo, rendimiento real sin sacrificar estilo.`;

  return {
    title,
    description,
    alternates: {
      canonical: collection.path,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${collection.path}`,
      type: "website",
    },
  };
}

/** Facets de "Tipo de producto" (con conteo) a partir del set completo, sin filtrar. */
function typeFacetsFor(products: Product[]) {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.productType, (counts.get(product.productType) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, label: typeLabel(value), count }))
    .sort((a, b) => b.count - a.count);
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort, tipo } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const [collection, allProducts] = await Promise.all([
    getCollection(params.collection),
    getCollectionProducts({ collection: params.collection, sortKey, reverse }),
  ]);

  if (!collection) return notFound();

  const activeTypes = (tipo ?? "").split(",").filter(Boolean);
  const products = activeTypes.length
    ? allProducts.filter((p) => activeTypes.includes(p.productType))
    : allProducts;

  const parentGender = parentGenderFor(params.collection);
  const breadcrumbItems = [
    { name: "Inicio", url: baseUrl },
    ...(parentGender
      ? [{ name: parentGender.title, url: `${baseUrl}${parentGender.path}` }]
      : []),
    { name: collection.title, url: `${baseUrl}/search/${params.collection}` },
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
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CollectionHeader
        title={collection.title}
        tabs={tabsFor(params.collection)}
        activePath={`/search/${params.collection}`}
      />

      <FilterBar types={typeFacetsFor(allProducts)} resultCount={products.length}>
        {products.length === 0 ? (
          <li className="col-span-full py-12 text-center text-neutral-500">
            {allProducts.length === 0
              ? "Todavía no hay productos publicados en esta colección."
              : "Ningún producto coincide con los filtros seleccionados."}
          </li>
        ) : (
          products.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))
        )}
      </FilterBar>
    </section>
  );
}
