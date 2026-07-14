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

Debajo de la barra principal hay un panel (`panelRef`) con "Términos de
búsqueda populares" (`POPULAR_SEARCH_TERMS` en `lib/constants.ts`) que
anima con altura 0→auto + fade/stagger en los chips — este es un simple
`gsap.timeline`, no usa Flip (no necesita medir rects, solo mostrar/ocultar).

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
`hero`), componente `mega-menu.tsx`. Es contenido placeholder (no hay
colecciones reales en Shopify todavía ni fotografía de producto) — el hero
usa un gradiente de marca en vez de foto real; sustituir por imagen real del
catálogo cuando exista.

**Tipografía — nota importante:** el usuario pidió imitar "la tipografía de
On Running", pero es una fuente propietaria de la marca (con derechos) —
**no se copió el archivo de fuente**. Se usó `Geist Bold` (ya instalada en
el proyecto vía el paquete `geist`) para lograr una sensación visual
similar (sans geométrica, bold, tight tracking) sin riesgo de derechos de
autor. Decisión confirmada con el usuario, ver `decisiones.md`.

## Pendientes conocidos

- Los links de categoría (`/search/mujer`, `/search/hombre`, `/search/ninos`)
  dan 404 hasta que existan esas colecciones en Shopify.
- El menú móvil combina `CATEGORY_LINKS` (hardcoded) + el menú real de
  Shopify (`getMenu`, vacío por ahora) — cuando se cree el menú en el Admin,
  van a aparecer ambos; decidir si eliminar el hardcoded en ese momento.
