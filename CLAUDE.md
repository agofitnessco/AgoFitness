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

| Doc                                            | Contenido                                                                                                                                                               |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/arquitectura.md`](docs/arquitectura.md) | Por qué headless, por qué Next.js Commerce, qué es Shopify vs qué es custom                                                                                             |
| [`docs/shopify.md`](docs/shopify.md)           | Cuenta, tienda, Storefront API, variables de entorno                                                                                                                    |
| [`docs/stack.md`](docs/stack.md)               | Stack técnico completo, estructura de carpetas                                                                                                                          |
| [`docs/decisiones.md`](docs/decisiones.md)     | Bitácora de decisiones (por qué se eligió X sobre Y)                                                                                                                    |
| [`docs/navbar.md`](docs/navbar.md)             | Cómo está armado el navbar: estructura, morph de búsqueda, mega menu                                                                                                    |
| [`docs/footer.md`](docs/footer.md)             | Estructura del footer y links pendientes de página real                                                                                                                 |
| [`docs/tienda.md`](docs/tienda.md)             | Guía de tallas, páginas de colección (`/search/[collection]`), FilterBar, ProductCard, estado del catálogo en Shopify, galería/variantes/carrito de `/product/[handle]` |
| [`docs/cuenta.md`](docs/cuenta.md)             | `/cuenta`: login, registro, recuperar contraseña, perfil, pedidos y direcciones — 100% custom con las mutations clásicas del Storefront API                             |

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
- **Guía de tallas real construida** (`/guia-de-tallas`, ver `docs/tienda.md`):
  medidas tomadas del fit guide oficial de Element (PDF de la marca),
  remapeadas a las tallas CH/M/G/XG que usan las variantes en Shopify.
  Línea Kisu queda con nota honesta de "pendiente" (su catálogo no trae
  guía de tallas) en vez de medidas inventadas.
- **Páginas de colección reconstruidas** (`/search/[collection]`, `/search`,
  ver `docs/tienda.md`): se eliminó el scaffold sin diseñar de Next.js
  Commerce (sidebar de colecciones + "Sort by" en inglés) y se reemplazó
  por `CollectionHeader` (eyebrow + título + pills de subcategoría) +
  `FilterBar` (ordenar por / tipo de producto / chips, todo en la URL,
  sticky al hacer scroll) + `ProductCard` que consume productos reales de
  Shopify (no hardcodeados como el carrusel).
- **Los 15 productos que quedaban en `DRAFT` (3 Hombre + 12 Kisu) se
  publicaron como `ACTIVE`** al canal Headless (14 julio 2026, decisión
  explícita del cliente) — Mujer pasó a 20 productos, Hombre a 3. **Los 12
  Kisu quedan a precio `$0.00` y son comprables así** — actualizar el precio
  real antes de que el sitio reciba tráfico de verdad.
- **Favoritos agregados** (corazón en las 3 tarjetas de producto del sitio +
  ícono con badge en el navbar + página `/favoritos`, ver `docs/tienda.md`):
  100% client-side vía `localStorage` — en ese momento no había cuentas de
  cliente en el proyecto, así que no hay backend ni sync entre
  dispositivos. **Nota (16 julio 2026): ya existe `/cuenta` con clientes
  reales (ver más abajo), pero favoritos no se migró** — sigue siendo
  client-side puro. El corazón
  se pone sólido en **rosa Ago (`#b48b8c`)** cuando el producto está en
  favoritos (en las tarjetas — el ícono del navbar se quedó neutro a
  propósito, el cliente prefirió no tintarlo).
- **Banner de distribuidor Gymco agregado al home** (`components/gymco-banner.tsx`,
  entre los dos carruseles "Lo más nuevo"/"Tendencias actuales"): el cliente
  mandó un diseño propio (gradiente dorado/rosa, hojas de palma, QR) que no
  combinaba con la estética del sitio — se tomó solo el contenido real
  (marca, "Distribuidora autorizada", contacto de Adriana Godoy) y se vistió
  como una tarjeta `rounded-lg` contenida en `max-w-screen-2xl` con gradiente
  suave de marca, igual que el resto de cards del sitio. Sin QR — el link de
  Instagram ya cumple esa función.
- **Carruseles del home ahora full-bleed** (`components/product-showcase.tsx`):
  la sección ya no vive dentro de `max-w-screen-2xl` — ocupa todo el ancho de
  la pantalla para que las tarjetas se salgan de verdad por el borde derecho
  al hacer scroll.
  **Alineación del `<ul>` con el título — breakout grid (14 julio 2026,
  corregido el mismo día):** el primer intento usó
  `pl-[max(1rem,calc((100vw-1536px)/2+1rem))]` para calcular el inset
  izquierdo del track a partir de `100vw` — matemáticamente correcto, pero
  frágil en la práctica (se desalineaba con el ancho real del scrollbar,
  zoom del navegador o devtools abierto — "se veía pegado a la izquierda").
  Se reemplazó por un **grid de 3 columnas**
  (`grid-cols-[minmax(1rem,1fr)_min(1536px,calc(100%_-_2rem))_minmax(1rem,1fr)]`,
  `lg:` con `2rem`/`4rem`) donde el título (`col-start-2`) y el `<ul>`
  (`col-start-2 col-end-4`) arrancan en la misma columna — quedan alineados
  por construcción, sin depender de `vw`. El `<ul>` además ocupa la columna
  derecha para poder salirse hasta el borde real de la pantalla.
  **Ojo, van 3 approaches que NO funcionaron y se descartaron antes de este:**
  (1) un `<li>` espaciador con ancho fijo (`w-0 lg:w-3`) — no compensaba el
  centrado de `max-w-screen-2xl` en pantallas anchas, quedaba pegado a la
  izquierda; (2) medir el inset con `useLayoutEffect` +
  `getBoundingClientRect()` contra el título — funcionaba en teoría pero el
  cliente pidió revertir; (3) el `pl` con `calc(100vw...)` de arriba. Si el
  grid de 3 columnas alguna vez se ve desalineado, no reintroducir ninguno
  de los dos anteriores — y seguir sin usar un `<li>` espaciador con padding
  dentro de un contenedor `scroll-snap` (el navegador "regresa" al soltar el
  scroll porque el padding pelea con los snap points).
- **Tarjetas de categoría (`components/category-showcase.tsx`) — probado y
  revertido (15 julio 2026):** se cambió brevemente `aspect-[3/4]` a
  `aspect-[4/3]` + más padding vertical de sección para que las tarjetas no
  midieran ~900px de alto en pantallas anchas, pero el cliente prefería el
  look original (retrato, más alto, `py-4`) — **se revirtió a como estaba**.
  No reintroducir el cambio a `aspect-[4/3]`/más padding sin confirmar de
  nuevo con el cliente.
- **Panel de búsqueda rediseñado estilo On Running (14-15 julio 2026)**
  (`nav-main.tsx` + `app/api/search-suggest/route.ts`, ver `docs/navbar.md`
  para el detalle completo): las pills pasaron de "Términos de búsqueda
  populares" a "Búsquedas sugeridas", y se agregó una sección "Productos"
  con resultados reales en vivo (más vendidos por default, filtrados por
  relevancia según se escribe, debounce 300ms). Dos layouts distintos según
  el navbar esté transparente (sobre el hero: tarjetas chicas junto a las
  pills, texto blanco, para no tapar el hero) o sólido (scrolleado: grid
  completo de `ProductCard` abajo, como antes) — con una transición de dos
  fases en GSAP (salida → swap de layout → entrada con stagger) si el
  usuario hace scroll con el buscador abierto.
- **6 mejoras de navbar (15 julio 2026)** (ver `docs/navbar.md`, sección
  "Mejoras del navbar"): indicador de link activo por ruta, bump en el
  badge del carrito al agregar, mensajes rotativos en la barra superior
  (solo hechos ya confirmados en el sitio, sin nombrar a Shopify a pedido
  del cliente), sección "Vistos recientemente" en el buscador
  (`lib/recently-viewed.ts`, mismo patrón 100% client-side que favoritos),
  skeleton mientras carga la primera respuesta de `/api/search-suggest`, y
  Escape para cerrar buscador/mega menu. **De paso se encontró y corrigió
  un bug pre-existente** (no causado por estas mejoras, confirmado con
  `git stash`): `/product/[handle]` devolvía 500 porque leía
  `product.featuredImage.url` sin optional chaining — como ningún producto
  tiene foto real todavía, `featuredImage` es `null`. Mismo tipo de bug
  que ya se había corregido en `cart/modal.tsx`, esta página se había
  quedado sin ese fix. Ver `docs/navbar.md`. Esa página sigue siendo en
  buena parte el scaffold sin rediseñar de Next.js Commerce visualmente —
  solo se arregló el crash, el rediseño sigue pendiente.
- **`/product/[handle]` rediseñada por completo (15 julio 2026, 8
  iteraciones sobre referencias de On Running y Alo Yoga)** — dejó de ser
  el scaffold de Next.js Commerce. Ver `docs/tienda.md`, sección "Página de
  producto individual", para el estado completo: galería en díptico con
  placeholder de gradiente + watermark (soporta fotos reales sin tocar
  código en cuanto existan), breadcrumb real por tags, swatches "foto",
  acordeón de info, fila Ajuste/Clima (heurística por tipo de prenda, no
  merchandising real), "Ideas para combinar" (shop-the-look), 3 paneles
  editoriales (`FeatureStory`) y un carrusel final de recomendaciones.
  **Nada de copy comercial se inventó sin confirmar** (cuotas de pago sin
  proveedor real, ajuste/clima como estimado, envíos/cuidado/materiales
  como "pendiente" explícito) — ver esa misma sección para el detalle de
  qué se preguntó antes de construir.
- **Fila Ajuste/Clima reubicada (15 julio 2026):** vivía como fila
  full-width separada del grid de 2 columnas de `/product/[handle]` — se
  sentía "flotando" con mucho espacio vacío a la derecha. Ahora vive dentro
  de la misma columna angosta del acordeón de info, justo debajo, como
  continuación del mismo bloque.
- **Bug corregido — carrusel del home sin link al producto (15 julio
  2026):** `components/product-showcase.tsx` (el carrusel "Lo más
  nuevo"/"Tendencias actuales") nunca envolvía la imagen en un `<Link>` —
  solo los swatches de color y "Añadir rápido" eran interactivos, la
  tarjeta no llevaba a `/product/{handle}`. Se agregó el mismo patrón que
  ya usa `collection/product-card.tsx` (Link solo alrededor de las capas
  de imagen, hermano del corazón/flyout, no padre — para no anidar
  botones dentro de un `<a>`).
- **Banner de Gymco desactivado (no eliminado), 15 julio 2026** — a pedido
  del cliente. Comentado en `app/page.tsx` (import + `<GymcoBanner />`),
  componente intacto en `components/gymco-banner.tsx`. Ver
  `docs/decisiones.md` para cómo reactivarlo.
- Pendiente: crear colección `ninos` (aún sin catálogo), precio real de
  Kisu (hoy en $0.00), sustituir los placeholders (hero, categorías,
  carrusel/tarjetas de colección, galería de producto, `featuredImage`
  del carrito) por fotografía real de producto/modelo, y seguir con el
  resto del home.
- **Navbar móvil reconstruida estilo On Running (15 julio 2026)** — ver
  `docs/navbar.md`, sección "Navbar móvil". Reemplaza el drawer lateral
  viejo (`mobile-menu.tsx`, retirado) por una barra fija al pie de
  pantalla (`mobile-nav-bar.tsx`, 5 íconos: buscar/favoritos/bolsa/
  cuenta/menú) que hereda el mismo estado `transparent` del navbar
  desktop (transparente sobre el hero, sólida al hacer scroll), más dos
  paneles a pantalla completa (`mobile-search-panel.tsx`,
  `mobile-menu-panel.tsx`) que suben desde abajo con Headless UI
  Transition/Dialog. El fetch de sugerencias de búsqueda se compartió
  entre desktop y mobile en `lib/use-search-suggest.ts`.
- **Toast de bienvenida del template eliminado (15 julio 2026)** —
  `components/welcome-toast.tsx` (el "🛍️ Welcome to Next.js Commerce!"
  que salía a cualquier visitante nuevo) se quitó de `app/layout.tsx` y
  se borró el archivo. Era copy del scaffold de Vercel, no de la marca.
- **Favicon y app icons reales (15 julio 2026)** — el wordmark
  `public/imgs/logo-ago.png` se recortó a su bounding box real y se
  centró sobre un cuadro blanco (el logo es un wordmark ancho, no un
  ícono cuadrado — a tamaños muy chicos como 16×16 se ve más como una
  mancha rosa que como "AGO", es una limitación del propio logo, no del
  recorte). Set completo generado: `app/favicon.ico` (multi-resolución
  16/32/48/64), `public/favicon-{16,32,48,96}x{...}.png`,
  `public/apple-touch-icon-{57,60,72,76,114,120,144,152,167,180}x{...}.png`
  (set clásico completo, no solo el 180×180 que Apple recomienda hoy —
  pedido explícito), `public/android-chrome-{192,512}x{...}.png` y
  `public/site.webmanifest`. Todo declarado vía `metadata.icons` /
  `metadata.manifest` en `app/layout.tsx` (no los file-conventions
  `app/icon.png`/`app/apple-icon.png` de Next, que solo soportan un
  tamaño cada uno sin `generateImageMetadata`). **Si el logo cambia,
  regenerar todo el set** — no editar cada PNG a mano.
- **`/product/[handle]` — galería, variantes y layout responsive (16 julio 2026)** — ver `docs/tienda.md` para el detalle completo. Resumen: la
  galería ahora es responsive por breakpoint (carrusel deslizable real en
  mobile con scroll-snap/swipe, el díptico original intacto en desktop);
  el layout mobile pasó de `grid` con `order-N` a `flex-col` (orden = DOM,
  sin ambigüedad — hubo un bug real donde Ajuste/Clima aparecía antes que
  la galería); `FitClimateRow` se movió de full-width a vivir junto al
  acordeón en desktop; se quitó la nota de cuotas/MSI (sin proveedor
  real); `VariantSelector` ganó microinteracciones (hover/tap scale,
  animación al seleccionar, check en swatches) y se corrigió que
  `isActive` no defaulteaba al primer valor sin `?color=`/`?talla=` en la
  URL; `InfoBadge` ganó `align` para que el popover no se salga de
  pantalla.
- **Bug corregido — carrito sin variante default (16 julio 2026):**
  `AddToCart` solo resolvía la variante si la URL traía
  `?color=X&talla=Y` explícitos — entrando desde un carrusel/
  recomendación (sin tocar los selectores) el botón quedaba deshabilitado
  en "Selecciona una opción". Fix: mismo fallback al primer valor
  (talla más chica, primer color) que ya usaba `VariantSelector`. Botón
  cambiado de rosa (`#b48b8c`) a negro. Ver `docs/tienda.md`.
- **Bug corregido — el carrito se abría doble (16 julio 2026):**
  `CartModal` está montado dos veces (navbar desktop + barra móvil),
  siempre en el DOM — cada instancia tenía su propio `useState` y su
  propio efecto de auto-apertura al subir `cart.totalQuantity`, así que
  al agregar un producto **ambas** se abrían a la vez (dos `<Dialog>`
  apilados, había que cerrar dos veces). Fix: `isCartOpen`/`openCart`/
  `closeCart` subieron a `CartContext` (estado compartido) y el panel se
  separó del botón trigger (`CartPanel`, montado una sola vez en
  `navbar-shell.tsx`). Ver `docs/navbar.md`.
- **Barra móvil en `/product/*` — crossfade carrito↔menú (16 julio
  2026):** al abrir el menú (☰) en la página de producto, el botón
  "Añadir al carrito" ahora se desvanece y aparece la fila de íconos
  normal, en vez de convivir encimados. Ver `docs/navbar.md`.
- **`/search/mujer` y `/search/hombre` ya existen en Shopify** (verificado
  16 julio 2026 contra el Storefront API real — 20 y 3 productos
  respectivamente). La nota vieja de "dan 404" en `docs/navbar.md` estaba
  desactualizada, se corrigió. **`/search/ninos` sigue sin colección**
  (confirmado con el cliente: sin catálogo de niños por ahora).
- **Footer — CTA superior más delgado en mobile (16 julio 2026):** pasó de
  apilado en columna (`py-16`) a una sola fila compacta (`py-8`, texto y
  botón más chicos en mobile). Se encontró y corrigió un bug de
  visibilidad: `FillButton` ya trae `inline-flex` hardcoded en su propio
  `baseClass`, así que pasarle `className="hidden"`/`"md:hidden"` desde
  afuera colisiona en especificidad y puede mostrar ambas versiones a la
  vez — la regla ahora es envolver cada instancia en su propio `<div>` de
  visibilidad en vez de pasarle `hidden`/`block`/`flex` por `className`.
  Ver `docs/footer.md`.
- **`/cuenta` construida desde cero (16 julio 2026)** — login, registro,
  recuperar contraseña, editar perfil, historial de pedidos y direcciones
  guardadas (con selector de país), 100% custom con la estética del
  sitio. Antes de construir se confirmó por introspección + prueba de
  login contra el Storefront API real que Ago Fitness todavía usa el
  sistema **clásico** de cuentas de cliente de Shopify (no las "New
  Customer Accounts" OAuth-only) — si eso cambia algún día, este flujo
  completo dejaría de funcionar y habría que rehacerlo. Ver
  `docs/cuenta.md` para el detalle completo (incluye por qué el correo es
  de solo lectura en el perfil, por qué recuperar contraseña siempre
  devuelve el mismo mensaje sin importar si el correo existe, y el fix al
  foco gris feo que traían los tabs por el `ring` global del sitio).
- **`/terminos` y `/privacidad` construidas (16 julio 2026)** — antes
  daban 404 (el catch-all `app/[page]/page.tsx` solo sirve páginas creadas
  en el Admin de Shopify, y no existían). Se optó por páginas propias con
  el diseño real del sitio en vez de contenido vía Shopify Admin.
  Contenido honesto: donde falta un dato real del cliente (razón social,
  domicilio fiscal, paquetería específica, plazos exactos de devolución)
  se marca explícito con una caja punteada "Pendiente: …" en vez de
  inventarlo — mismo criterio que ya se sigue en el resto del sitio.
  **Formato (iterado a pedido del cliente, referencia on.com):** primer
  intento fue con índice/tabla de contenido + secciones en prosa; se
  descartó por un acordeón — `components/legal-accordion.tsx`
  (`LegalAccordion`, reutilizable, mismo patrón grid-rows +/× que
  `product-info-accordion.tsx`), un panel abierto a la vez, sin índice.
- **`/contacto` construida (16 julio 2026, referencia on.com)** — hero +
  grid 2 col: `components/contact-form.tsx` (formulario con selects en
  cascada motivo → submotivo, mostrando nombre/correo/mensaje solo una vez
  elegido el motivo) y `components/contact-faq.tsx` (buscador +
  `LegalAccordion` con `numbered={false}`). Envío real vía **Resend**
  (`app/contacto/actions.ts`, server action con `useActionState`, mismo
  patrón que `app/cuenta/actions.ts`) — variables `RESEND_API_KEY`,
  `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` en `.env.local`/`.env.example`.
  Si `RESEND_API_KEY` no está configurada, el formulario no falla en
  silencio: muestra un error real pidiendo escribir a hola@agofitness.com
  mientras tanto. `CONTACT_FROM_EMAIL` quedó con un remitente placeholder
  (`contacto@agofitness.com`) — **confirmar que sea el remitente
  verificado real en Resend antes de producción**.
- **`FillButton` ganó soporte de `disabled`** (para el submit de
  `/contacto` mientras Resend procesa el envío, evitar doble envío) —
  agrega `disabled:pointer-events-none disabled:opacity-60` a
  `components/ui/fill-button.tsx`; no aplica a la variante `href` (los
  links no se deshabilitan).
- **Links de Contacto agregados al navbar (16 julio 2026):** junto a
  "Ayuda" en la barra superior desktop (`navbar-shell.tsx`) y debajo de
  "Centro de ayuda" en el menú móvil (`mobile-menu-panel.tsx`).
- **Bug corregido — selects del formulario de contacto en mobile (16 julio
  2026):** el label flotante (`Cuéntanos el motivo de tu consulta`, etc.)
  no tenía límite de ancho ni `truncate`, así que en pantallas angostas
  podía envolver a 2 líneas y encimarse con el valor seleccionado o con el
  ícono de chevron. Fix en `components/contact-form.tsx`: label con
  `left-4 right-9 truncate` (ancho acotado, una sola línea con ellipsis) y
  el `<select>` con `pr-9` (antes `px-4` simétrico) para no correr texto
  bajo el chevron. De paso, tanto los `<select>` como los `<input>`/
  `<textarea>` del formulario pasaron de `text-sm` a `text-base` — con
  menos de 16px Safari iOS hace zoom automático al enfocar un campo, un
  bug real de mobile, no solo estético.
- **Bug corregido — pill Entrar/Crear cuenta de `/cuenta` en mobile (16
  julio 2026):** con `px-6 text-sm uppercase tracking-wide` fijo en ambas
  mitades del pill (`grid-cols-2`), "CREAR CUENTA" no cabía en una línea
  en pantallas angostas y rompía el pill. Fix en
  `components/account/auth-panel.tsx`: `text-[11px] px-2` en mobile,
  `sm:text-sm sm:px-6` en desktop, más `whitespace-nowrap` y
  `flex items-center justify-center` para centrar de verdad en vez de
  depender solo del padding.
- **`/soporte` construida (16 julio 2026, referencia on.com/ALO)** — antes
  el link "Centro de ayuda"/"Ayuda" del footer y navbar apuntaba a un
  404. Estructura: hero → grid "Temas" (`components/help-center.tsx`,
  tarjetas que al hacer clic saltan y abren la sección correspondiente del
  acordeón de abajo vía `scrollIntoView` + estado `openId` compartido, más
  una tarjeta "Contacto directo" que enlaza de verdad a `/contacto`) →
  buscador con pills sugeridas que filtran el FAQ por texto/keywords → el
  mismo acordeón `grid-rows` +/× que `product-info-accordion.tsx` /
  `legal-accordion.tsx`, pero con control de apertura externo (no se
  reutilizó `LegalAccordion` porque este necesita `openId` accesible desde
  las tarjetas de arriba) → `components/help-contact-cards.tsx` con los
  **3 canales reales** (correo, formulario de `/contacto`, Instagram). A
  diferencia de la referencia de on.com/ALO (que tiene chat en vivo,
  llamada telefónica y SMS), **no se inventaron esos canales** — Ago
  Fitness no los tiene, así que no aparecen.
- **Eyebrow "Ago Fitness" quitado del hero de `/soporte`, `/contacto`,
  `/terminos` y `/privacidad`** (16 julio 2026, a pedido del cliente) — el
  `<h1>` de las 4 páginas ahora es el primer elemento de la sección, sin
  el `<p className="... uppercase">Ago Fitness</p>` que iba arriba.
