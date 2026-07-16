import {
  detailGradient,
  firstColorHex,
  modelGradient,
  productGradient,
} from "lib/color-placeholder";
import { climateFor, fitFor, typeLabel } from "lib/product-types";
import { Product } from "lib/shopify/types";
import Image from "next/image";

const FIT_COPY: Record<string, string> = {
  Ajustado: "Se ciñe al cuerpo para acompañar cada movimiento sin estorbar.",
  Holgado: "Corte amplio y cómodo — para traerla todo el día sin pensarlo.",
  Estándar: "Ni muy ceñido ni muy amplio: el corte clásico de toda la vida.",
};

const CLIMATE_COPY: Record<string, string> = {
  Cálido: "Pensada para los días de calor — ligera y transpirable.",
  Frío: "Pensada para protegerte cuando baja la temperatura.",
  Templado: "Va bien en temperaturas intermedias, ni frío ni calor.",
  "Todo el año": "Funciona en cualquier temporada, sin importar el clima.",
};

function Panel({
  gradient,
  title,
  body,
}: {
  gradient: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
        <Image
          src="/imgs/logo-ago.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain p-16 opacity-20 mix-blend-overlay"
        />
        <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase backdrop-blur-sm">
          Foto próximamente
        </div>
      </div>
      <h3 className="mt-5 text-2xl font-bold tracking-tight text-black sm:text-3xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{body}</p>
    </div>
  );
}

export function FeatureStory({ product }: { product: Product }) {
  const hex = firstColorHex(product);
  const fit = fitFor(product.productType);
  const climate = climateFor(product.productType);

  const panels = [
    {
      gradient: productGradient(hex),
      title: `Corte ${fit.toLowerCase()}`,
      body: FIT_COPY[fit] ?? "",
    },
    {
      gradient: modelGradient(hex),
      title: `Para clima ${climate.toLowerCase()}`,
      body: CLIMATE_COPY[climate] ?? "",
    },
    {
      gradient: detailGradient(hex),
      title: typeLabel(product.productType),
      body: product.description,
    },
  ];

  return (
    <div className="mt-16 border-t border-neutral-200 pt-12 lg:mt-24">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {panels.map((panel) => (
          <Panel key={panel.title} {...panel} />
        ))}
      </div>
    </div>
  );
}
