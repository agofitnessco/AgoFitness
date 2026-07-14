# Shopify — cuenta, tienda, API

## Cuenta y tienda

- **Cuenta Partner:** Flouvia Growth Boutique (`hola@flouvia.com`) — es la
  cuenta de agencia con la que se crea/administra la tienda del cliente.
- **Tienda:** Ago Fitness
  - Admin: `https://admin.shopify.com/store/ago-fitness-3`
  - Dominio para API/CLI: `ago-fitness-3.myshopify.com`
  - Tipo de creación: **Client transfer** (la tienda se transfiere al cliente
    más adelante — no es solo un dev store interno).

## Storefront API — cómo se conecta el frontend

El template Next.js Commerce habla con Shopify vía **Storefront API**
(GraphQL, de solo lectura de catálogo + operaciones de carrito). Para
conectarlo:

1. En el Admin de Shopify: **Settings → Apps and sales channels → Develop apps**
   → crear una app custom → habilitar **Storefront API** → generar el
   **Storefront API access token**.
2. Copiar `.env.example` a `.env.local` en la raíz del proyecto y llenar:

```
SHOPIFY_STORE_DOMAIN="ago-fitness-3.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="<token generado arriba>"
SHOPIFY_REVALIDATION_SECRET="<string random propio>"
SITE_NAME="Ago Fitness"
COMPANY_NAME="Ago Fitness"
```

`SHOPIFY_REVALIDATION_SECRET` es un secreto que tú inventas (no viene de
Shopify) — se usa para el webhook de revalidación (cuando cambias un producto
en el Admin, Shopify llama a un endpoint del sitio para invalidar caché).

## Cómo se obtuvo el Storefront API token (registro real)

El camino de "Dev Dashboard → app personalizada" (crear app, instalarla, buscar
scopes) resultó confuso: el botón "Gestionar" del Storefront API dentro de
Dev Dashboard redirige a la página de Partners de solicitud de **scopes
avanzados de Admin API** (pedidos completos, suscripciones, etc.), que no
tiene nada que ver con el Storefront API y requiere aprobación de Shopify.

**Ruta que sí funcionó:** el canal de ventas **"Headless"** (Shopify App
Store → buscar "Headless" → instalar). Al crearlo pide nombrar el storefront
y entrega el Storefront API access token directo, sin pasar por Partners ni
pedir scopes uno por uno. Es la ruta oficial que recomienda Vercel para
Next.js Commerce.

La app personalizada creada en Dev Dashboard (`Ago Fitness Storefront`)
quedó instalada en la tienda pero sin uso — se puede eliminar más adelante
si no se necesita para nada más (webhooks, Admin API, etc.).

## Qué NO se toca desde el código

- Checkout — siempre redirige al dominio de Shopify.
- Inventario/precios — se editan en el Admin, el frontend solo los lee.
- Pagos, impuestos, envíos — configuración 100% en el Admin (Settings →
  Payments/Taxes/Shipping), no hay nada que programar ahí.
