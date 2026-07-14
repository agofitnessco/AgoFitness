# Tienda — páginas de colección, guía de tallas, favoritos y catálogo

> Construido 14 julio 2026. Cubre: `/guia-de-tallas`, `/search/[collection]`
> (Mujer/Hombre/Niños + sub-colecciones), `/search` (búsqueda por texto),
> `/favoritos`, y el estado del catálogo real en Shopify tras esta sesión.

## Guía de tallas (`/guia-de-tallas`)

Archivo: `app/guia-de-tallas/page.tsx` + `components/size-guide.tsx` (client,
por el toggle Mujer/Hombre).

- **Medidas reales**, no inventadas: tomadas del fit guide oficial de Element
  (`CATALOGO ELEMENT_P_Publico.pdf`, páginas "GUÍA DE TALLAS MUJER/HOMBRE").
  El PDF usa XS/S/M/L/XL — se remapearon a **CH/M/G/XG**, que son los nombres
  de talla reales usados en las variantes de Shopify (XS del PDF no se vende,
  se omitió).
- **Línea Kisu** (conjuntos/leggings/enterizos) usa tallas S/M/L/XL pero su
  catálogo (`catalogo kisu 2025.pdf`) no trae guía de tallas — se dejó una
  nota honesta de "pendiente" en vez de inventar medidas. Actualizar esta
  sección en cuanto el proveedor la comparta.
- Diseño: título sin eyebrow arriba (el cliente rechazó ese patrón), tabs
  pill negro/gris (no underline — se probó el estilo underline de ALO y se
  descartó por no sentirse "de la casa"), tabla en tarjeta `rounded-xl` con
  zebra striping sutil — mismo lenguaje que el resto del sitio.
- Links "Guía de tallas" del mega menu (`lib/constants.ts`) y footer
  (`components/layout/footer.tsx`) apuntan aquí — antes apuntaban a
  `/soporte`, que nunca existió.

## Páginas de colección (`/search/[collection]`)

Antes era el scaffold genérico de Next.js Commerce (sidebar de colecciones +
"Sort by" en inglés, sin diseñar — se eliminó por completo, ver más abajo).
Ahora: `app/search/[collection]/page.tsx` (server) compone:

1. **`CollectionHeader`** (`components/collection/collection-header.tsx`) —
   eyebrow "COMPRAR" + `<h1>` grande con el título real de la colección +
   pills de subcategoría (solo en las páginas raíz de género: mujer/hombre/
   ninos). Las pills salen de `MEGA_MENU` en `lib/constants.ts` (misma fuente
   que el mega menu del navbar — no hay una segunda lista de categorías que
   mantener sincronizada).
2. **`FilterBar`** (`components/collection/filter-bar.tsx`, client) — botón
   "Mostrar/Ocultar filtros (n)" + contador de resultados, y al abrir: chips
   de "Filtros aplicados" (removibles) + "Borrar todos", "Ordenar por"
   (Destacados/Novedades/Precio asc/desc — `sorting` en `lib/constants.ts`,
   traducido a español y reducido a 4 opciones, antes tenía "Trending" en
   inglés sin usarse en ningún lado más) y "Tipo de producto" (checkboxes con
   conteo, generados dinámicamente desde `productType` de los productos de
   *esa* colección — no una lista hardcodeada).
   - Todo el estado de filtro vive en la URL (`?tipo=Top,Legging&sort=price-asc`)
     vía `useSearchParams`/`router.push` — enlazable, funciona con back/forward.
   - **Sticky (14 julio 2026):** la fila de toggle+conteo es
     `sticky top-[116px]` (116px = alto del navbar: 36px barra superior + 80px
     barra principal) tanto abierto como cerrado. El panel de filtros, cuando
     está abierto, es `sticky top-[168px]` con su propio scroll interno
     (`max-h-[calc(100svh-184px)] overflow-y-auto`) para no salirse de
     pantalla si la lista de filtros crece.
   - El grid pasa de 4 a 3 columnas cuando el panel está abierto (le cede el
     espacio a la columna de filtros).
   - **Bug de client/server boundary corregido:** `typeLabel()` vivía en
     `filter-bar.tsx` (que tiene `"use client"`) pero se llamaba desde el
     Server Component de la página para calcular los facets — Next.js no
     permite invocar una función exportada de un archivo cliente desde el
     servidor (error: "Attempted to call typeLabel() from the server but
     typeLabel is on the client"). Se movió a `lib/product-types.ts` (módulo
     compartido sin `"use client"`), importado por ambos lados.
3. **`ProductCard`** (`components/collection/product-card.tsx`, client) — a
   diferencia del carrusel del home (`product-showcase.tsx`, que usa datos
   hardcodeados en `lib/product-showcase-data.ts` con GIDs curados a mano),
   esta tarjeta consume **productos reales de Shopify tal cual los devuelve
   la Storefront API** (`Product` de `lib/shopify/types.ts`):
   - Agrupa `product.variants` por la opción "Color" (si existe) y junta las
     tallas disponibles (opción "Talla") por color. Productos sin opción de
     color (los conjuntos Kisu, una sola combinación por título) caen en un
     grupo neutro sin swatches, solo tallas.
   - Mismo lenguaje visual que el carrusel: gradiente placeholder que hace
     swap producto-solo → "con modelo" en hover, flyout "Añadir rápido" con
     tallas, swatches de color, quick-add real al carrito (`addCartItem` +
     server action `addItem` dentro de `startTransition`).
   - **Espaciado swatches→nombre (14 julio 2026):** cuando hay swatches, el
     `<p>` del nombre no llevaba ningún `margin-top` (solo se aplicaba
     `mt-3` en el caso sin swatches) — quedaba pegado. Se igualó al patrón
     del carrusel: `mt-2` cuando hay swatches, `mt-3` cuando no.
   - `lib/color-placeholder.ts` centraliza el mapa color→hex y las funciones
     de gradiente (`shade`/`productGradient`/`modelGradient`) — usado tanto
     por esta tarjeta como por el carrusel (antes duplicado en
     `product-showcase.tsx`). Un color sin mapear cae a un gris determinado
     por hash del nombre (nunca truena, nunca se ve igual a otro color real).

**Handles con pills reales (Mujer):** `tops`, `playeras-mujer`, `leggings`,
`conjuntos`, `faldas`, `shorts-mujer`, `chamarras`. **Hombre:** `playeras`,
`shorts-hombre`. Ver `docs/navbar.md` para cómo se crearon estas colecciones
smart en Shopify.

### `productType` en el fragment de Shopify

`lib/shopify/fragments/product.ts` y `lib/shopify/types.ts` (`ShopifyProduct`)
no traían `productType` — se agregó porque el facet "Tipo de producto" del
`FilterBar` lo necesita. Pasa a `Product` automáticamente vía el spread en
`reshapeProduct` (`lib/shopify/index.ts`), no requirió tocar esa función.

## Búsqueda por texto (`/search`)

`app/search/page.tsx` — mismo `ProductCard`/grid que las colecciones, textos
traducidos a español ("Mostrando N resultados para…"). No tiene `FilterBar`
(fuera de scope por ahora — productos de distintos géneros mezclados, los
facets de tipo tendrían que reconsiderarse).

## Favoritos (corazón en las tarjetas + `/favoritos`)

No hay cuentas de cliente en este proyecto (no hay Clerk ni ningún login),
así que favoritos es **100% client-side, persistido en `localStorage`** —
sin backend, sin sync entre dispositivos.

- **`lib/favorites.ts`** — funciones planas (`getFavorites`, `toggleFavorite`,
  `isFavorite`, `subscribeFavorites`) que leen/escriben la key
  `ago:favorites` en `localStorage` y disparan un evento custom
  (`ago:favorites-changed`) en cada cambio para notificar a otras pestañas/
  componentes montados. Guarda un **snapshot ligero** por producto
  (`handle`, `title`, `price`, `currencyCode`, `colorHex`) — no solo el
  handle — para poder pintar `/favoritos` sin volver a pedirle nada a
  Shopify.
- **`lib/use-favorites.ts`** (`"use client"`) — `useFavorites()` /
  `useIsFavorite(handle)` sobre `useSyncExternalStore`, para que el corazón
  se actualice reactivamente en cualquier tarjeta montada cuando cambia el
  estado en otra.
- **`components/favorites/heart-button.tsx`** — botón corazón (outline/solid
  de Heroicons) posicionado `absolute top-3 right-3` sobre la imagen de la
  tarjeta. `stopPropagation`+`preventDefault` en el click para no disparar
  el `Link` de navegación al producto que está debajo. Outline con
  `strokeWidth={2.2}` (más bold que el default de Heroicons) en estado
  normal; **sólido en rosa Ago (`#b48b8c`)** cuando el producto está en
  favoritos. El corazón del navbar (`nav-favorites.tsx`) se probó también en
  rosa al "prenderse" pero el cliente pidió dejarlo neutro (outline
  negro/blanco según `transparent`, badge negro/blanco) — el rosa se quedó
  solo en las tarjetas.
  - **Bug corregido:** `getFavorites()` (usado como `getSnapshot` de
    `useSyncExternalStore` en `use-favorites.ts`) hacía `JSON.parse` en cada
    llamada, devolviendo un array nuevo cada vez — React lo detecta como "el
    store cambió" en cada render y entra en loop infinito ("Maximum update
    depth exceeded" / "the result of getSnapshot should be cached"). Fix en
    `lib/favorites.ts`: cachear el array en memoria (`cache` a nivel de
    módulo) y solo generar uno nuevo cuando `write()` realmente cambia algo.
- **Integrado en las 3 tarjetas de producto del sitio:**
  `components/collection/product-card.tsx` (páginas de colección/búsqueda),
  `components/product-showcase.tsx` (carrusel del home) y las tarjetas
  simplificadas de `/favoritos` mismo (para poder quitar desde ahí).
  - En `collection/product-card.tsx` hubo que **mover el `<Link>` para que
    envuelva solo las capas de imagen**, no toda la tarjeta — antes el
    `Link` envolvía también el flyout de "Añadir rápido"; el corazón (y el
    flyout) ahora son hermanos del `Link` dentro del mismo contenedor
    `relative`, no hijos, para evitar anidar botones dentro de un `<a>`.
- **Ícono en el navbar** (`components/favorites/nav-favorites.tsx`) — corazón
  con badge de conteo, agregado junto al carrito en `nav-main.tsx` (dentro del
  mismo `cartRef` que colapsa a 0 cuando se abre el buscador, y en la versión
  mobile `md:hidden`). Mismo patrón visual que `OpenCart`/`BagIcon`
  (`h-11 w-11`, color condicionado a `transparent` sobre el hero).
- **`app/favoritos/page.tsx`** (`"use client"` — necesita leer `localStorage`
  en el cliente, no hay forma de hacerlo desde un Server Component) — grid
  de 4 columnas con lo guardado, estado vacío con link a `/search/mujer`.

## Limpieza — scaffold eliminado

El layout compartido de `/search` (`app/search/layout.tsx`) traía el sidebar
por defecto de Next.js Commerce: `Collections` (lista de todas las
colecciones de Shopify) + `FilterList` con título "Sort by" en inglés —
nunca se diseñó, no combinaba con nada del sitio (incluía clases `dark:`
aunque el sitio fuerza light mode siempre). Se eliminó junto con los
componentes que quedaron huérfanos:
`components/layout/product-grid-items.tsx`, `components/layout/search/`
(collections.tsx + filter/). Si se necesita un listado de "todas las
colecciones" en el futuro, construir uno nuevo con el lenguaje visual del
sitio — no revivir estos archivos.

## Estado del catálogo en Shopify (14 julio 2026)

- **Mujer: 20 productos ACTIVE** (8 Element + 12 Kisu) — publicados al canal
  Ago Fitness Headless.
- **Hombre: 3 productos ACTIVE** (Second Playera, Shift Playera, Easy Short)
  — publicados al canal Headless.
- **Los 12 productos Kisu están a precio `$0.00` y son técnicamente
  comprables así** — decisión explícita del cliente ("publicar todo tal cual,
  incluido Kisu a $0.00") para poder ver el catálogo completo en las páginas
  de colección mientras se define precio real. **Actualizar el precio antes
  de que el sitio reciba tráfico real** — si no, alguien podría comprar esas
  piezas gratis.
- Niños sigue sin colección/productos — pendiente.
