# Arquitectura

## Por qué headless (y no un theme Liquid)

Shopify por defecto usa **Liquid** (Online Store 2.0): Shopify renderiza el HTML
server-side desde templates, con checkout, carrito, apps y buscador ya incluidos.
Es la ruta más rápida de lanzar y la que usa la mayoría de marcas DTC, incluso
premium — el acabado visual de una Lululemon/Adidas se puede lograr en Liquid
con buen CSS/animación (GSAP, etc.), el framework no limita el nivel visual.

Se decidió ir **headless** para este proyecto de todas formas: control total del
frontend en React/Next.js en vez de Liquid, aceptando el trabajo adicional que
eso implica (ver abajo). Decisión registrada en
[`decisiones.md`](decisiones.md).

## Qué sigue siendo de Shopify vs qué es custom

| Pieza | Headless (este proyecto) |
|-------|---------------------------|
| **Checkout** (pago) | 100% Shopify — nunca se reconstruye. Se redirige al checkout hosteado por Shopify (PCI compliance, etc. lo maneja Shopify). |
| **Datos de producto/inventario/precio** | Vive en Shopify Admin. Se consulta vía **Storefront API** (GraphQL). |
| **Carrito (drawer, "3 items")** | Custom — se construye la UI en React/Next, pero la lógica de qué contiene el carrito se resuelve contra la Cart API de Shopify. |
| **Buscador, filtros de colección** | Custom — hay que construirlos contra la Storefront API; Liquid los trae gratis, headless no. |
| **Apps de la App Store** | Muchas apps asumen inyectar su script en un theme Liquid — en headless hay que verificar compatibilidad app por app (reviews, upsells, etc.) o integrarlas manualmente vía su API. |
| **Admin (productos, órdenes, analytics)** | Siempre el admin normal de Shopify — no cambia con la arquitectura del frontend. |

## Por qué Next.js Commerce (y no Hydrogen)

Hydrogen es el framework headless oficial de Shopify (React + Remix, hosting en
Oxygen). Se eligió **Next.js Commerce** (template oficial de Vercel,
`vercel/commerce`) en su lugar porque:
- Ya viene con el provider de Shopify (Storefront API) integrado — no hay que
  armar cliente GraphQL desde cero.
- Encaja con el stack existente de Flouvia (Vercel, Next.js-adjacent tooling).
- Deploy directo en Vercel (mismo flujo que otros proyectos de la agencia) en
  vez de Oxygen.

## Diagrama mental del flujo de datos

```
Shopify Admin (productos, inventario, órdenes)
        │
        ▼  Storefront API (GraphQL, solo lectura de catálogo/carrito)
Next.js (Vercel) — frontend custom, todo el diseño/UX
        │
        ▼  al dar "Pagar"
Shopify Checkout (hosteado por Shopify, dominio de la tienda)
```
