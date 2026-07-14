# Ago Fitness — CLAUDE.md

Tienda de e-commerce headless para el cliente **Ago Fitness** (Flouvia como agencia
desarrolladora). Objetivo: nivel visual/UX de marcas premium de activewear
(Lululemon, Adidas, Alo Yoga) — logrado con un frontend 100% custom, no con un
theme de Shopify.

## Comandos esenciales

```bash
npm run dev      # servidor local (localhost:3000)
npm run build    # build de producción
npm run start    # servir el build de producción
```

## Repositorio

`https://github.com/agofitnessco/AgoFitness.git` — branch principal `main`.
Repo separado del de Flouvia (agencia); este es propiedad/proyecto del
cliente Ago Fitness.

## Documentación

La documentación está dividida por tema en `docs/`:

| Doc | Contenido |
|-----|-----------|
| [`docs/arquitectura.md`](docs/arquitectura.md) | Por qué headless, por qué Next.js Commerce, qué es Shopify vs qué es custom |
| [`docs/shopify.md`](docs/shopify.md) | Cuenta, tienda, Storefront API, variables de entorno |
| [`docs/stack.md`](docs/stack.md) | Stack técnico completo, estructura de carpetas |
| [`docs/decisiones.md`](docs/decisiones.md) | Bitácora de decisiones (por qué se eligió X sobre Y) |
| [`docs/navbar.md`](docs/navbar.md) | Cómo está armado el navbar: estructura, morph de búsqueda, mega menu |
| [`docs/footer.md`](docs/footer.md) | Estructura del footer y links pendientes de página real |

**Regla:** este archivo (`CLAUDE.md`) se mantiene corto — es un índice. El detalle
y contexto va en `docs/`. Cuando se tome una decisión nueva de arquitectura o se
aprenda algo no obvio del código, actualizar el doc correspondiente en `docs/`,
no este archivo.

## Estado actual (13 julio 2026)

- Tienda Shopify creada: `ago-fitness-3.myshopify.com` (cuenta Partner: Flouvia
  Growth Boutique). Storefront API conectada vía el canal **Headless** (ver
  `docs/shopify.md`) — `.env.local` ya tiene el token real.
- Se descartó el theme Liquid (Skeleton) inicial — queda archivado en
  `_archive-liquid-theme/` solo de referencia, no se usa.
- Proyecto scaffolded desde **Next.js Commerce** (template oficial de Vercel,
  `vercel/commerce`), que ya trae el provider de Shopify integrado vía
  Storefront API.
- **Navbar construido** (ver `docs/navbar.md` para el detalle completo):
  fondo blanco forzado en todo el sitio (sin dark mode), barra superior
  `#b48b8c`, logo real (`public/imgs/logo-ago.png`) + categorías
  Mujer/Hombre/Niños, buscador que hace morph in-place con GSAP Flip, mega
  menu al hover de las categorías (estilo On Running).
- **Footer construido** (ver `docs/footer.md`): declaración de marca +
  botón "Conócenos", newsletter + columnas Tienda/Ayuda/Empresa, sociales
  con link real de Instagram. Componente compartido `FillButton`
  (`components/ui/fill-button.tsx`) para CTAs con relleno animado —
  reutilizarlo en vez de crear botones nuevos desde cero.
- Repo conectado a GitHub (`agofitnessco/AgoFitness`) — ver sección
  "Repositorio" arriba.
- **Hero del home construido** (`components/layout/hero.tsx`): imagen a
  pantalla completa (`h-[100svh]`, placeholder de gradiente por ahora —
  pendiente sustituir por foto real) con el navbar flotando transparente
  encima y volviéndose sólido al hacer scroll (ver `docs/navbar.md`,
  sección "Navbar transparente sobre el hero").
- **Sección de categorías construida** (`components/category-showcase.tsx`):
  grid de 3 tarjetas (Mujer/Hombre/Niños, reutiliza `CATEGORY_LINKS`) justo
  debajo del hero — mismo lenguaje visual que `HeroCard` del mega menu
  (gradiente placeholder + overlay + label + botón circular con flecha).
  Referencia de diseño: la tira de categorías de On Running (`on.com`).
- **Productos reales cargados en Shopify** (14 julio 2026): colecciones
  `Mujer` (20 productos: 8 de línea Element con precio real + 12 de línea
  Kisu con precio `$0.00` placeholder — catálogo sin precio, pendiente
  definir) y `Hombre` (3 productos Element: Second Playera, Shift Playera,
  Easy Short). Todos en `DRAFT` — faltan fotos de producto para activarlos.
- **Carrusel "Lo más nuevo" construido** (`components/product-showcase.tsx`,
  client component): inspirado en Alo Yoga/On Running — tarjeta con imagen
  que hace swap producto-solo → con-modelo en hover (dos capas de gradiente,
  placeholder hasta tener fotografía real), flyout "Añadir rápido" con
  tallas que sube desde abajo, swatches de color reales, y flechas de
  scroll (`scrollBy` suave). Datos (nombre/precio/color/talla) vienen de
  los 8 productos reales de la línea Element (Mujer) ya en Shopify.
  Insertado en el home justo debajo de `CategoryShowcase`.
- **Los 8 productos Element (Mujer) están `ACTIVE` y publicados al canal
  "Ago Fitness Headless"** (14 julio 2026) — necesario para que la
  Storefront API (y por tanto el carrito) pueda verlos: un producto en
  `DRAFT` o no publicado a ese canal específico es invisible para la
  Storefront API aunque el ID de variante sea correcto. Kisu/Hombre siguen
  en `DRAFT` (Kisu sin precio real, Hombre sin decidir aún).
- **Quick-add del carrusel conectado al carrito real** (`lib/product-showcase-data.ts`
  guarda el GID de producto/variante real de cada combinación talla+color
  de Element; `ProductCard` en `product-showcase.tsx` llama `addCartItem`
  (optimista, contexto global `useCart`) + el server action `addItem`
  dentro de un mismo `startTransition` — sin esto React tira "optimistic
  update outside a transition"). El drawer del carrito se abre solo porque
  `CartModal` ya escuchaba cambios en `cart.totalQuantity` del contexto
  global — no hizo falta wiring extra para eso.
- **Bug de plantilla corregido:** `components/cart/modal.tsx` asumía que
  todo producto en el carrito tiene `featuredImage` no-nulo — truena con
  productos sin foto (todos los nuestros, por ahora). Se le puso fallback
  a `/imgs/logo-ago.png` con optional chaining. Esto afectaba a cualquier
  producto sin imagen, no solo al carrusel.
- **Mega menu conectado a colecciones reales** (14 julio 2026, ver
  `docs/navbar.md`): se crearon 9 colecciones smart en Shopify (una por
  `product_type` × género vía regla `TAG`) — `tops`, `playeras-mujer`,
  `leggings`, `conjuntos`, `faldas`, `shorts-mujer`, `chamarras` (Mujer) y
  `playeras`, `shorts-hombre` (Hombre) — todas publicadas al canal Headless
  (igual que Mujer/Hombre, que tampoco lo estaban). `MEGA_MENU` en
  `lib/constants.ts` ya no usa `?tag=` inventados (el search page no los
  soporta) sino paths reales a estos handles.
  **Correcciones de catálogo del cliente el mismo día:** "Force Soft" y
  "Alpha Soft" no eran `Top`, son `Playera` (Alpha Soft sin mangas); y
  "Enterizo" no es categoría aparte de "Conjunto" para esta marca — los 4
  Kisu que eran `Enterizo` se reclasificaron a `Conjunto` y esa colección
  se eliminó. No asumir taxonomía de producto sin confirmar con el cliente.
- Pendiente: crear colección `ninos` (aún sin catálogo), precios reales
  para la línea Kisu, sustituir los placeholders (hero, categorías,
  carrusel, `featuredImage` del carrito) por fotografía real de
  producto/modelo, y seguir con el resto del home.
