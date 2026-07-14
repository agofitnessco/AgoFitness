# Navbar

Archivos: `components/layout/navbar/index.tsx` (server, shell) → renderiza
`nav-main.tsx` (client, toda la interactividad) + `mobile-menu.tsx` (drawer
móvil, sin cambios grandes).

## Estructura de dos niveles

1. **Barra superior** (`#b48b8c`, 36px de alto) — links de utilidad: Ayuda,
   Mi cuenta. Fija arriba de todo (dentro del wrapper `sticky`).
2. **Barra principal** (80px de alto, blanca, `backdrop-blur`) — de
   izquierda a derecha: botón de menú móvil (solo `<md`), logo,
   categorías Mujer/Hombre/Niños (`CATEGORY_LINKS` en `lib/constants.ts`),
   buscador, carrito.

Todo el wrapper (`<div className="sticky top-0 z-40">` en `index.tsx`)
queda pegado arriba al hacer scroll.

**Logo real (13 julio 2026):** el wordmark de texto se reemplazó por el
logo real del cliente — `public/imgs/logo-ago.png` (viene con transparencia,
color `#b48b8c` ya integrado al diseño de la marca). Renderizado con
`next/image` en `nav-main.tsx`, `h-18` de alto. Si se necesita el logo en
otro lado del sitio (footer, favicon, etc.), reutilizar ese mismo archivo
en vez de pedir uno nuevo.

## Buscador — morph in-place con GSAP Flip

**Objetivo de diseño:** al abrir la búsqueda, la píldora pequeña ("Buscar")
debía crecer *en su propio lugar* hasta ocupar el espacio de
Mujer/Hombre/Niños (que se ocultan) — no un dropdown que empuja contenido
hacia abajo. Esto es exactamente lo que resuelve el plugin **Flip** de GSAP
(mide el rect antes/después de un cambio de layout y anima la transición).

Implementado en `nav-main.tsx`:

1. `requestToggle(next)` llama `Flip.getState(...)` sobre los 3 elementos
   que van a cambiar de tamaño (`linksRef`, `searchWrapRef`, `cartRef`) ANTES
   de cambiar el state de React.
2. El cambio de state (`isSearchOpen`) dispara el re-render: los links se
   colapsan a `width: 0`, el buscador pasa a `flex: 1 1 0%` (llena el
   espacio), el carrito se colapsa.
3. En un `useLayoutEffect` (corre después del DOM update, antes del paint),
   se llama `Flip.from(state, { duration, ease, absolute: true })` — Flip
   interpola desde el rect viejo (guardado en el paso 1) hasta el nuevo
   (ya aplicado por React), dando la sensación de que el elemento "creció".

**Bug corregido (13 julio 2026):** el primer open se veía "extenderse de
más y luego saltar a su posición normal". Causa: el contenedor de búsqueda
mezclaba `width: "100%"` **y** `flex: "1 1 auto"` al mismo tiempo — el
navegador resolvía el tamaño en dos pasadas de layout distintas (una por
`width`, otra por `flex-grow`) y Flip alcanzaba a medir el rect en un
estado intermedio. Fix: controlar el tamaño **solo** con `flex-basis`
(`flex: "1 1 0%"` abierto / `flex: "0 0 12rem"` cerrado), sin `width` — una
sola pasada de cálculo, consistente en el primer render.

**Anillo de foco:** el input tenía el `ring` global que `globals.css` aplica
a todos los inputs/botones (`focus-visible:ring-2`). Se desactivó
puntualmente en este input con `focus-visible:ring-0
focus-visible:ring-offset-0`.

Debajo de la barra principal hay un panel (`panelRef`, altura 0→auto con
`gsap.timeline`, no usa Flip — no necesita medir rects, solo mostrar/ocultar)
con dos bloques: pills de "Búsquedas sugeridas" (`POPULAR_SEARCH_TERMS` en
`lib/constants.ts`) y, debajo/al lado, una sección "Productos" con
resultados reales — ver siguiente sección.

## Panel de búsqueda — resultados en vivo estilo On Running (14-15 julio 2026)

**Referencia de diseño:** el buscador de On Running (`on.com`) — al abrir,
muestra pills de "Búsquedas sugeridas" + una sección "Productos" con
tarjetas reales que se actualizan según lo que se escribe.

**Ruta API** (`app/api/search-suggest/route.ts`, GET, `?q=`): llama
`getProducts` de `lib/shopify` — sin `q` devuelve los más vendidos
(`sortKey: "BEST_SELLING", reverse: true`, para el estado default al abrir
sin escribir nada), con `q` filtra por `sortKey: "RELEVANCE"`. Recorta a 4
resultados (`SUGGEST_LIMIT`). En `nav-main.tsx`, un `useEffect` hace fetch
a esta ruta con debounce (300ms si hay texto, inmediato si está vacío) cada
vez que cambia `query`, con `AbortController` para cancelar requests viejos
si el usuario sigue escribiendo.

**Dos layouts según si el navbar está transparente (sobre el hero) o sólido
(scrolleado)** — el grid completo de `ProductCard` (mismo componente que las
páginas de colección) se ve bien sobre fondo blanco, pero sobre el hero
transparente tapaba el copy/CTA de la imagen debajo:

- **Transparente:** `flex flex-col gap-6 lg:flex-row lg:justify-between` —
  pills a la izquierda, y a la derecha (o debajo en mobile) hasta 3
  tarjetas **chicas** (`MiniProductCard`, componente local del archivo,
  solo imagen `aspect-[3/4]` + título + precio, sin swatches/quick-add —
  demasiado detalle para el espacio). Pills y texto en **blanco** (outline
  `border-white/50`, hover invierte a blanco sólido/texto negro) para
  distinguirse sobre cualquier imagen de hero.
- **Sólido:** layout original — pills oscuras arriba, "Productos" como
  título + grid `grid-cols-2 sm:grid-cols-4` de `ProductCard` reales abajo
  (mismas tarjetas grandes de las colecciones, con swatches y quick-add).

Click en cualquier producto (`onClick` con `closest("a")` en el `<ul>`)
cierra el panel antes de que la navegación del `Link` complete.

**Transición de dos fases al cambiar de layout mientras el panel sigue
abierto** (el usuario puede hacer scroll con la búsqueda abierta — el
crossfade instantáneo anterior "se veía brincado" al cambiar de golpe entre
dos layouts tan distintos, texto blanco↔negro y flex-row↔stacked):

1. Un estado `displayTransparent` (no la prop `transparent` directa) es el
   que decide qué layout se renderiza — va "un paso detrás" del estado real
   del navbar mientras el panel está abierto.
2. Al detectar que `transparent` cambió con el panel abierto: **salida**
   (`gsap.to` del contenedor a `opacity:0, y:±10`, 0.2s `power2.in`) →
   `onComplete` actualiza `displayTransparent` (ahí React monta el layout
   nuevo).
3. Un segundo `useLayoutEffect`, con dependencia solo en `displayTransparent`
   (no en `isSearchOpen` — si no, se dispara también en el open/close normal
   y duplica la animación de chips que ya hace el efecto de apertura del
   panel), hace la **entrada**: selecciona `[data-chip], [data-panel-item]`
   dentro del contenedor y las anima con `fromTo({opacity:0,y:12},
   {opacity:1,y:0}, stagger:0.05, power2.out)` — mismo lenguaje de motion
   que el resto del sitio (nada de scale/blur).

`data-panel-item` se puso en: el título "Búsquedas sugeridas", el `<li>` de
cada `MiniProductCard`, y el título+grid de "Productos" en modo sólido (como
bloques, no tarjeta por tarjeta — el `ProductCard` compartido no tiene ese
atributo, no se le agregó solo para esto).

## Mega menu (categorías)

Al hacer hover sobre Mujer/Hombre/Niños se abre un panel full-width debajo
del navbar. **Referencia de diseño (13 julio 2026): el mega menu de On
Running** — layout de 2 bloques, no de columnas tipo tabla:

- **Izquierda:** imagen/hero grande (`aspect-[16/9]`, `rounded-lg` — poco
  redondeado a propósito, el usuario rechazó el `rounded-2xl` anterior por
  verse "como tarjeta" en vez de foto editorial) con overlay de gradiente
  oscuro abajo, título + subtítulo + botón "Ver ahora".
- **Derecha:** lista plana de links primarios en texto grande y bold
  (`text-2xl font-bold`, sin mayúsculas, sin agrupar en columnas con
  encabezado — imitando cómo On lista Mujer/Hombre/Niños directo, sin
  categorizar visualmente), y debajo una fila de links secundarios más
  pequeños y grises (guía de tallas, centro de ayuda, etc.) separada por un
  hairline.

Datos en `MEGA_MENU` (`lib/constants.ts`: `primaryLinks`, `secondaryLinks`,
`hero`), componente `mega-menu.tsx`.

**Categorías reales (14 julio 2026):** los primaryLinks de Mujer/Hombre ya
apuntan a colecciones smart reales creadas en Shopify (una por
`product_type`, con regla `TAG = mujer|hombre` para no mezclar género):
`tops`, `playeras-mujer`, `leggings`, `conjuntos`, `faldas`, `shorts-mujer`,
`chamarras` (Mujer) y `playeras`, `shorts-hombre` (Hombre). Todas publicadas
al canal **Ago Fitness Headless** (sin esto la Storefront API las devuelve
vacías aunque existan en el Admin — las colecciones `Mujer`/`Hombre`
tampoco estaban publicadas ahí y se corrigió al mismo tiempo). El hero
sigue usando gradiente placeholder (no hay fotografía de producto todavía)
pero el `path` ya apunta a una colección real, no a un `?tag=` inexistente
— **la ruta `/search/[collection]` (`app/search/[collection]/page.tsx`)
resuelve por handle de colección, no soporta querystring `?tag=`**, así que
cualquier link nuevo del mega menu debe apuntar a un handle de colección
real, no inventar un tag. `Niños` sigue sin productos/colección — placeholder
"Próximamente" hasta que exista el catálogo real (ver CLAUDE.md, pendientes).

**Correcciones de catálogo (14 julio 2026, mismo día):** el cliente
corrigió la clasificación inicial de 2 productos — "Element Force Soft" y
"Element Alpha Soft" no son `Top`, son `Playera` (Alpha Soft es una playera
sin mangas, tag `sin-mangas` añadido). Y "Enterizo" no es una categoría
aparte de "Conjunto" para esta marca — los 4 productos Kisu que tenían
`product_type: Enterizo` se reclasificaron a `Conjunto` (la colección
`enterizos` se eliminó, sus productos ya caen en `conjuntos`). **Lección:**
no asumir taxonomía de producto sin confirmar con el cliente — categorías
que parecen obvias desde afuera (enterizo ≠ conjunto) pueden no aplicar a
cómo la marca realmente organiza su catálogo.

**Tipografía — nota importante:** el usuario pidió imitar "la tipografía de
On Running", pero es una fuente propietaria de la marca (con derechos) —
**no se copió el archivo de fuente**. Se usó `Geist Bold` (ya instalada en
el proyecto vía el paquete `geist`) para lograr una sensación visual
similar (sans geométrica, bold, tight tracking) sin riesgo de derechos de
autor. Decisión confirmada con el usuario, ver `decisiones.md`.

## Navbar transparente sobre el hero (13 julio 2026)

**Objetivo de diseño:** en el home, el navbar flota transparente sobre el
hero de imagen a pantalla completa (`components/layout/hero.tsx`) y se
vuelve sólido blanco al hacer scroll — patrón estándar de marcas premium
(Lululemon, Alo Yoga). En el resto de páginas (búsqueda, producto, etc.)
no hay hero de imagen debajo, así que el navbar se queda sólido siempre.

**Archivos:**
- `components/layout/navbar/navbar-shell.tsx` (nuevo, client) — reemplaza
  el wrapper que antes vivía directo en `index.tsx`. Decide `transparent`
  con dos condiciones: `usePathname() === "/"` (solo home) y `scrollY <= 40`
  (antes de hacer scroll). Si es home Y no ha hecho scroll → `absolute`
  (no empuja el hero hacia abajo, flota encima) + barra superior
  `bg-transparent`. En cualquier otro caso → `sticky` + barra superior
  `bg-[#b48b8c]` (comportamiento de siempre).
- `components/layout/navbar/index.tsx` — ahora solo hace el fetch del
  menú (`getMenu`, server) y renderiza `<NavbarShell>`; toda la lógica de
  scroll/pathname vive en el client component porque `index.tsx` es
  `async`/server y no puede usar hooks.
- `nav-main.tsx` recibe la prop `transparent` y la usa para togglear:
  fondo del `<nav>` (`bg-transparent` vs `bg-white/95 backdrop-blur-md`),
  color de los links de categoría, botón "Cancelar" del buscador, y se la
  pasa hacia abajo a `<MobileMenu>` y `<CartModal>` (que a su vez se la
  pasa a `<OpenCart>` para el ícono de bolsa + badge de cantidad). El
  buscador (pill gris) y el mega menu (panel blanco) **no** cambian de
  color — ya tienen su propio fondo claro y se leen bien sobre cualquier
  hero.
- `components/layout/hero.tsx` (nuevo) — sección `h-[100svh]` con overlay
  oscuro (`from-black/50 via-black/5 to-black/70`) para que el texto
  blanco del navbar (arriba) y de la copy del hero (abajo) tengan
  contraste, con el placeholder de fondo (gradiente radial rosa→navy) en
  medio. **Pendiente:** sustituir el div de fondo por una foto real
  (producto/modelo) cuando el cliente la entregue — mismo patrón de
  placeholder que ya se usaba en el mega menu.

**Pendiente conocido:** el logo (`public/imgs/logo-ago.png`) es la versión
rosa de siempre — no hay variante blanca/clara todavía. Sobre el gradiente
placeholder actual se lee aceptable, pero cuando se ponga la foto real del
hero, revisar contraste y pedir al cliente una versión clara del logo si
hace falta.

## Mejoras del navbar (15 julio 2026)

Seis mejoras puntuales manteniendo la estructura existente (morph de
búsqueda, mega menu, transparente-sobre-hero):

1. **Indicador de link activo:** el subrayado bajo Mujer/Hombre/Niños
   (`nav-main.tsx`) antes solo aparecía en `mouseenter` (`activeCategory`).
   Ahora, cuando no hay hover, también se muestra si `usePathname() ===
   item.path` — así el usuario ve en qué sección está sin necesidad de
   pasar el mouse. Comparación exacta de ruta (no `startsWith`): las
   sub-colecciones (`tops`, `leggings`, etc.) son handles independientes,
   no rutas anidadas bajo `/search/mujer`, así que no hay forma honesta de
   marcarlas como "dentro de Mujer" sin una tabla de mapeo — no se agregó.
2. **Bump en el badge del carrito** (`components/cart/open-cart.tsx`, ahora
   `"use client"`): cuando `quantity` sube (se agregó algo), un
   `gsap.fromTo` con `yoyo:true, repeat:1` hace un pequeño "pop" (scale
   1→1.35→1, 0.18s). No anima si baja (se quitó algo) ni en el mount
   inicial — solo confirma la acción de agregar.
3. **Barra superior con mensajes rotativos** (`navbar-shell.tsx`): antes
   solo tenía Ayuda/Mi cuenta a la derecha (`justify-end`). Se agregó un
   mensaje a la izquierda (`justify-between`) que rota cada 4s con fade
   (`.topbar-fade`, keyframe en `app/globals.css`, respeta
   `prefers-reduced-motion`) entre 3 mensajes — **todos anclados a hechos
   ya confirmados en el sitio, no inventados**: "Nueva colección
   disponible" (copy real del hero), "Pago 100% seguro y encriptado"
   (hecho de arquitectura del checkout, sin nombrar al proveedor a
   propósito — pedido explícito del cliente), "Síguenos en Instagram
   @agofitnessco" (handle real del footer). Oculto en mobile
   (`hidden sm:block`) para no saturar la barra angosta. Array
   `TOP_BAR_MESSAGES` en `navbar-shell.tsx` — actualizar copy ahí.
4. **"Vistos recientemente" en el panel de búsqueda:** mismo patrón
   100%-client-side de `lib/favorites.ts` (sin cuentas de cliente, sin
   backend), nuevo módulo `lib/recently-viewed.ts` +
   `lib/use-recently-viewed.ts` (`useSyncExternalStore`, cache en memoria
   para evitar el loop de "getSnapshot debe estar cacheado"). Un
   componente invisible (`components/product/record-recently-viewed.tsx`,
   `useEffect` en mount) montado en `app/product/[handle]/page.tsx`
   registra la vista — snapshot liviano (handle/título/precio/color, no el
   `Product` completo). En `nav-main.tsx`, con el buscador **vacío**: si
   hay historial, "Vistos recientemente" reemplaza a los más vendidos
   (`showRecentlyViewed`); en cuanto se escribe algo, la búsqueda en vivo
   manda como siempre. Tarjeta nueva `RecentMiniCard` (a diferencia de
   `MiniProductCard`, que es blanca fija porque solo vive en modo
   transparente, esta acepta prop `light` porque aparece en ambos
   layouts). `firstColorHex` se movió de `nav-main.tsx` a
   `lib/color-placeholder.ts` (ahora compartido entre el navbar y el
   registro de vista).
5. **Skeleton mientras carga la primera respuesta de
   `/api/search-suggest`:** antes, con `isSuggestLoading=true` y
   `suggestProducts` aún vacío, no se mostraba nada — el bloque
   "Productos" aparecía de golpe. Nuevos `MiniSkeletonCard` (modo
   transparente, 3 placeholders `animate-pulse` del tamaño de
   `MiniProductCard`) y `GridSkeletonCard` (modo sólido, 4 placeholders
   del tamaño de `ProductCard`).
6. **Escape cierra lo que esté abierto** (`nav-main.tsx`): un
   `useEffect` con listener de `keydown` en `document` — si el buscador
   está abierto lo cierra primero (`closeSearch()`); si no, y hay un mega
   menu abierto, lo cierra (`setActiveCategory(null)`).

**Bug pre-existente encontrado (no de estas mejoras):**
`/product/[handle]` (ej. `/product/element-top`) devuelve **500** — se
confirmó con `git stash` que el error ya estaba ahí antes de estas 6
mejoras, no lo causó ninguna de ellas. Esa página sigue siendo en buena
parte el scaffold sin rediseñar de Next.js Commerce (texto en inglés,
clases `dark:`, etc. — a diferencia de colecciones/carrusel/checkout que sí
se rehicieron). Pendiente investigar y arreglar por separado.

## Pendientes conocidos

- Los links de categoría (`/search/mujer`, `/search/hombre`, `/search/ninos`)
  dan 404 hasta que existan esas colecciones en Shopify.
- El menú móvil combina `CATEGORY_LINKS` (hardcoded) + el menú real de
  Shopify (`getMenu`, vacío por ahora) — cuando se cree el menú en el Admin,
  van a aparecer ambos; decidir si eliminar el hardcoded en ese momento.
