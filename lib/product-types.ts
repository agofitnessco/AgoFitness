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

export function fitFor(productType: string) {
  return FIT_BY_TYPE[productType] ?? "Estándar";
}

export function climateFor(productType: string) {
  return CLIMATE_BY_TYPE[productType] ?? "Cálido";
}
