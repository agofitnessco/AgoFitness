import { AddToCart } from "components/cart/add-to-cart";
import HeartButton from "components/favorites/heart-button";
import Prose from "components/prose";
import { firstColorHex, productGradient } from "lib/color-placeholder";
import { CATEGORY_LINKS, MEGA_MENU } from "lib/constants";
import { typeLabel } from "lib/product-types";
import { Product } from "lib/shopify/types";
import Link from "next/link";
import { VariantSelector } from "./variant-selector";

function CompleteTheLook({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;

  return (
    <div className="mb-6 border-t border-neutral-200 pt-6">
      <p className="mb-3 text-xs font-bold tracking-[0.16em] text-neutral-500 uppercase">
        Queda bien con...
      </p>
      <Link
        href={`/product/${product.handle}`}
        className="group flex items-center gap-4"
      >
        <div className="relative h-20 w-16 flex-none overflow-hidden rounded-md">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: productGradient(firstColorHex(product)) }}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-black">
            {product.title}
          </p>
          <p className="text-sm text-neutral-500">
            MX${Number(price.amount).toLocaleString("es-MX")}
          </p>
          <span className="mt-1 inline-block text-xs font-bold tracking-wide text-black uppercase underline underline-offset-2 group-hover:no-underline">
            Ver más
          </span>
        </div>
      </Link>
    </div>
  );
}

/**
 * Deriva "Comprar > Género > Tipo" a partir de los tags reales del producto
 * (las colecciones smart de Shopify ya se arman con reglas de tag por
 * género, ver docs/navbar.md) — no hardcodea taxonomía nueva. Exportada:
 * también la usa `app/product/[handle]/page.tsx` para el JSON-LD
 * `BreadcrumbList`, así el schema no puede desincronizarse del breadcrumb
 * visible — una sola fuente de verdad.
 */
export function breadcrumbFor(product: Product) {
  const gender = CATEGORY_LINKS.find((c) =>
    product.tags.some((tag) => tag.toLowerCase() === c.title.toLowerCase()),
  );
  const typeEntry = gender
    ? MEGA_MENU[gender.title as keyof typeof MEGA_MENU]?.primaryLinks.find(
        (link) => link.label === typeLabel(product.productType),
      )
    : undefined;

  return { gender, typeEntry };
}

export function ProductDescription({
  product,
  completeWith,
}: {
  product: Product;
  completeWith?: Product;
}) {
  const price = product.priceRange.minVariantPrice;
  const { gender, typeEntry } = breadcrumbFor(product);

  return (
    <>
      <nav className="mb-4 flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-neutral-500 uppercase">
        <Link href="/search" className="hover:text-black">
          Comprar
        </Link>
        {gender ? (
          <>
            <span className="text-neutral-300">›</span>
            <Link href={gender.path} className="hover:text-black">
              {gender.title}
            </Link>
          </>
        ) : null}
        {typeEntry ? (
          <>
            <span className="text-neutral-300">›</span>
            <Link href={typeEntry.path} className="hover:text-black">
              {typeEntry.label}
            </Link>
          </>
        ) : null}
      </nav>

      <div className="mb-2 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
          {product.title}
        </h1>
        <HeartButton
          variant="inline"
          className="mt-1"
          item={{
            handle: product.handle,
            title: product.title,
            price: price.amount,
            currencyCode: price.currencyCode,
            colorHex: firstColorHex(product),
          }}
        />
      </div>

      <p className="mb-6 border-b border-neutral-200 pb-6 text-xl font-semibold text-black">
        MX${Number(price.amount).toLocaleString("es-MX")}
      </p>

      {product.descriptionHtml ? (
        <Prose
          className="mb-8 text-sm leading-relaxed text-neutral-600"
          html={product.descriptionHtml}
        />
      ) : null}

      <VariantSelector options={product.options} variants={product.variants} />
      {completeWith ? <CompleteTheLook product={completeWith} /> : null}
      <AddToCart product={product} />
    </>
  );
}
