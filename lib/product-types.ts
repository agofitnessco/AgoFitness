const TYPE_LABELS: Record<string, string> = {
  Top: "Tops",
  Chamarra: "Chamarras",
  Falda: "Faldas",
  Legging: "Leggings",
  Conjunto: "Conjuntos",
  Short: "Shorts",
  Playera: "Playeras",
};

export function typeLabel(value: string) {
  return TYPE_LABELS[value] ?? `${value}s`;
}

/**
 * Ajuste/clima por tipo de prenda — heurística aproximada, NO merchandising
 * real (Shopify no tiene ese dato por producto hoy). Confirmado con el
 * cliente que esto es una estimación aceptable mientras no se clasifique el
 * catálogo a mano; el badge "i" en el UI aclara que es estimado.
 */
const FIT_BY_TYPE: Record<string, string> = {
  Legging: "Ajustado",
  Top: "Ajustado",
  Conjunto: "Ajustado",
  Playera: "Holgado",
  Falda: "Holgado",
  Short: "Holgado",
  Chamarra: "Holgado",
};

const CLIMATE_BY_TYPE: Record<string, string> = {
  Chamarra: "Frío",
  Legging: "Todo el año",
  Conjunto: "Templado",
};

/**
 * Overrides por producto — para la línea Second Skin (única con fotografía
 * real hasta ahora) el default por tipo se ve mal: son shorts/playeras de
 * compresión, no genéricos "Holgado". Visto directo en la foto + la propia
 * descripción del producto (todas dicen "compresión"/"licra"), no
 * inventado. El resto del catálogo (Element/Kisu, sin foto real) se queda
 * con el estimado genérico por tipo hasta que se pueda confirmar igual.
 */
const FIT_OVERRIDE_BY_TITLE: Record<string, string> = {
  "Biker Cova": "Ajustado",
  "Jacket Elan": "Ajustado",
  "Playera Apex Tee": "Ajustado",
  "Playera Atlas": "Ajustado",
  "Short Licra Range": "Ajustado",
};

export function fitFor(productType: string, title?: string) {
  if (title && FIT_OVERRIDE_BY_TITLE[title]) return FIT_OVERRIDE_BY_TITLE[title];
  return FIT_BY_TYPE[productType] ?? "Estándar";
}

export function climateFor(productType: string) {
  return CLIMATE_BY_TYPE[productType] ?? "Cálido";
}
