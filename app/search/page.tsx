import ProductCard from "components/collection/product-card";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Buscar",
  description: "Busca productos en la tienda.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 lg:px-8">
      {searchValue ? (
        <p className="mb-8 text-lg">
          {products.length === 0
            ? "No hay productos que coincidan con "
            : `Mostrando ${products.length} ${products.length > 1 ? "resultados" : "resultado"} para `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
