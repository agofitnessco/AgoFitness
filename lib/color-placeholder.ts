import type { Product } from "lib/shopify/types";

/**
 * Placeholder de marca por color — genera un gradiente a partir de un hex
 * mientras no hay fotografía real de producto. `COLOR_HEX` cubre los
 * nombres de color reales ya cargados en Shopify (línea Element + Kisu);
 * un nombre nuevo que no esté en el mapa cae a un gris neutro determinado
 * por hash del string (nunca truena, nunca se ve igual a otro color real).
 */
export const NEUTRAL_HEX = "#c9c9c4";

export const COLOR_HEX: Record<string, string> = {
  Negro: "#1a1a1a",
  // Verde oliva medio (fotos reales Element: Top/Jacket/Falda/Biker/Legging Cacto)
  Cacto: "#6e7c5a",
  // Rosa polvo/dusty rose (fotos reales — NO es rojo ladrillo)
  Passion: "#b1616d",
  Blanco: "#f5f5f2",
  // Azul cielo pastel, claro (fotos reales Force Soft/Alpha Soft Azzure)
  Azzure: "#a9d2e8",
  // Lila muy pálido, casi blanco con tinte lavanda (fotos reales Skylilac)
  Skylilac: "#dcd7ea",
  // Azul-gris pálido (fotos reales Element Second Playera — NO es verde/teal)
  Ohana: "#cbd6dc",
  // Salvia/verde sage claro (fotos reales Second/Shift Playera, Easy Short)
  Herb: "#a9bfa0",
  // Terracota/cocoa cálido — compromiso entre el tono Element (más naranja)
  // y el tono Kisu (más mauve/café) ya que ambas líneas usan el mismo nombre
  Cocoa: "#a56a4a",
  Gris: "#7d7d7d",
  Rosa: "#d98fa3",
  Naranja: "#d97a3f",
  "Naranja largo": "#d97a3f",
  // Línea Second Skin (ver lib/second-skin-data.ts — mismos hex ahí)
  Cielo: "#b8d3ea",
  Arena: "#ede0d0",
  Grafito: "#3a3a42",
  Terracota: "#c17b57",
  Salvia: "#a8bdac",
  Ciruela: "#423d47",
  Blush: "#f1dcd8",
  Bruma: "#dfe4f2",
  Marino: "#1c2438",
  Plomo: "#6c7178",
};

function hashHex(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const gray = 90 + (Math.abs(hash) % 60);
  const hex = gray.toString(16).padStart(2, "0");
  return `#${hex}${hex}${hex}`;
}

export function colorHex(name: string) {
  return COLOR_HEX[name] ?? hashHex(name);
}

export function shade(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + amt);
  const g = clamp(((num >> 8) & 0x00ff) + amt);
  const b = clamp((num & 0x0000ff) + amt);
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

export function productGradient(hex: string) {
  return `linear-gradient(135deg, ${shade(hex, 45)} 0%, ${hex} 45%, ${shade(hex, -55)} 100%)`;
}

export function modelGradient(hex: string) {
  return `linear-gradient(135deg, ${hex} 0%, ${shade(hex, -35)} 55%, ${shade(hex, -70)} 100%)`;
}

/** Tercera variante — usada en paneles editoriales (ej. `FeatureStory`) que necesitan 3 fotos distintas de la misma prenda. */
export function detailGradient(hex: string) {
  return `linear-gradient(200deg, ${shade(hex, -20)} 0%, ${hex} 55%, ${shade(hex, 40)} 100%)`;
}

/**
 * Color de la primera variante de un producto — usado donde solo hace falta
 * UN color representativo (tarjetas chicas, snapshot de recientemente
 * visto), a diferencia de `ProductCard`/`product-showcase.tsx` que agrupan
 * TODAS las variantes por color para los swatches.
 */
export function firstColorHex(product: Product): string {
  const colorValue = product.variants[0]?.selectedOptions.find(
    (o) => o.name.toLowerCase() === "color",
  )?.value;
  return colorValue ? colorHex(colorValue) : NEUTRAL_HEX;
}
