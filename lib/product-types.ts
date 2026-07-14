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
