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
  Negro: "#171717",
  Cacto: "#7a8a6a",
  Passion: "#8f3b4a",
  Blanco: "#f2f2ee",
  Azzure: "#4a6fa5",
  Skylilac: "#b9aed6",
  Ohana: "#2f6f6b",
  Cocoa: "#6b4a3a",
  Gris: "#8a8a8a",
  Rosa: "#d98fa3",
  Naranja: "#d97a3f",
  "Naranja largo": "#d97a3f",
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
