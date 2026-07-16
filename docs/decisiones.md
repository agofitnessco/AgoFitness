# Bitácora de decisiones

Registro de decisiones de arquitectura/producto y el razonamiento detrás —
para no repetir la discusión más adelante.

## 2026-07-13 — Headless en vez de theme Liquid

**Decisión:** construir el frontend de Ago Fitness 100% custom (Next.js +
Storefront API) en vez de un theme Liquid personalizado.

**Contexto:** el objetivo visual es nivel Lululemon/Adidas/Alo Yoga. Se
evaluó que ese nivel de acabado es alcanzable en Liquid (Online Store 2.0)
con buen CSS/GSAP — el framework no es el limitante ahí. Aun así, se optó por
headless para tener control total del frontend en React.

**Trade-off aceptado:** se pierde compatibilidad automática con apps de la
Shopify App Store (muchas asumen inyección de script en un theme Liquid) y
hay que reconstruir a mano: UI de carrito, buscador, filtros de colección.
El checkout y el Admin no cambian — siguen siendo 100% Shopify sin importar
la arquitectura del frontend (ver [`arquitectura.md`](arquitectura.md)).

## 2026-07-13 — Next.js Commerce en vez de Hydrogen

**Decisión:** usar el template `vercel/commerce` (Next.js) en vez de Hydrogen
(framework headless oficial de Shopify).

**Razón:** Next.js Commerce ya trae el provider de Shopify vía Storefront API
integrado, y el stack/deploy (Vercel) es el mismo que ya usa la agencia en
otros proyectos — evita introducir Oxygen (hosting de Hydrogen) como una
plataforma nueva a mantener.

## 2026-07-13 — Se descarta el theme Liquid inicial

Se había inicializado un theme Liquid (Skeleton) vía `shopify theme init`
antes de decidir ir headless. Se archivó en `_archive-liquid-theme/` (sin
personalización, boilerplate puro) en vez de borrarlo, por si servía de
referencia. No se usaba en el proyecto.

**Actualización (15 julio 2026):** eliminada por completo — semanas
trabajando 100% headless sin haberla necesitado. Si en algún momento hace
falta consultar el boilerplate original del theme Skeleton, está disponible
vía `shopify theme init` de nuevo (es el scaffold estándar de Shopify, no
algo personalizado que se perdiera).

## 2026-07-13 — Sitio 100% claro, sin dark mode

**Decisión:** se removieron todas las clases `dark:` del template (navbar,
carrito, layout raíz) y se forzó `color-scheme: light` en `globals.css`.

**Razón:** el objetivo visual (Lululemon/Adidas/Alo Yoga) es un sitio claro;
dejar el dark mode automático de Next.js Commerce (basado en
`prefers-color-scheme`) invertía los colores en el navegador de cualquier
usuario con el sistema en modo oscuro, sin que hubiera un toggle visible —
inconsistente con la marca. Si en el futuro se quiere dark mode, debe ser
una decisión de diseño explícita con su propio toggle, no el default del
template.

## 2026-07-13 — Categorías hardcodeadas en vez de menú dinámico de Shopify

**Decisión:** los links "Mujer / Hombre / Niños" del navbar viven como
constante estática (`CATEGORY_LINKS` en `lib/constants.ts`), no vía
`getMenu()` de Shopify (que sigue existiendo para el menú real cuando se
cree en el Admin).

**Razón:** la tienda todavía no tiene el menú `next-js-frontend-header-menu`
creado en Shopify, así que `getMenu()` devuelve un arreglo vacío. Se
hardcodeó para poder avanzar el diseño del navbar sin bloquear en esa tarea
de Shopify. **Pendiente:** cuando se creen las colecciones reales (`mujer`,
`hombre`, `ninos`), evaluar si conviene migrar esto a un menú dinámico del
Admin en vez de mantenerlo hardcodeado.

## 2026-07-13 — Mega menu: se usa Geist Bold, no la tipografía de On Running

**Decisión:** el usuario pidió que el mega menu (rediseñado a imagen de la
referencia visual de On Running — ver `navbar.md`) usara "la tipografía de
On". Se le preguntó explícitamente cómo resolverlo porque la fuente de On
es propietaria de esa marca. Eligió usar **Geist Bold** (ya en el proyecto)
en vez de instalar una fuente geométrica nueva de Google Fonts.

**Razón:** cero riesgo de derechos de autor, cero trabajo extra de carga de
fuente, y Geist Bold ya da una sensación visual similar (sans geométrica,
bold, tight tracking) a la referencia.

## 2026-07-15 — Banner de Gymco desactivado (no eliminado) del home

**Decisión:** se comentó el `import` y el `<GymcoBanner />` en
`app/page.tsx` (entre los dos carruseles "Lo más nuevo"/"Tendencias
actuales") a pedido del cliente. **El componente no se borró** —
`components/gymco-banner.tsx` sigue intacto en el repo.

**Para reactivarlo:** descomentar las dos líneas marcadas en
`app/page.tsx` (el import y `<GymcoBanner />`). No requiere reconstruir
nada — el componente sigue funcionando tal cual quedó documentado en
`CLAUDE.md` (sección "Estado actual", banner de distribuidor Gymco).

## 2026-07-15 — Navbar móvil: barra fija de íconos (On Running) en vez de drawer lateral

**Decisión:** se retiró por completo el drawer lateral (`mobile-menu.tsx`,
`Dialog` deslizando desde la izquierda) y se reemplazó por una barra fija
al pie de pantalla con 5 íconos (buscar/favoritos/bolsa/cuenta/menú) que
abren paneles a pantalla completa desde abajo — mismo patrón que el
mobile de On Running (`on.com`), pedido explícito del usuario con
capturas de referencia. Ver `docs/navbar.md`, sección "Navbar móvil", para
el detalle de archivos.

**Razón:** el drawer lateral no aprovechaba que el navbar ya tenía el
estado `transparent` (transparente sobre el hero, sólido al hacer scroll)
— era un botón sólido de siempre en la esquina, out of place sobre un hero
a pantalla completa. La barra fija hereda `transparent` directamente del
navbar desktop y da una sensación más "app nativa" acorde a la referencia.
De paso se aprovechó `MEGA_MENU` (ya existente para el mega menu desktop)
para que el menú móvil tenga acordeón con subcategorías reales en vez de
la lista plana que tenía el drawer viejo.

**Alternativa descartada:** mantener el drawer y solo re-skinnearlo no
lograba el efecto "flotando sobre el hero + icon bar tipo app" que pedía
la referencia — la estructura (posición fija vs. panel lateral) es
distinta de raíz, no solo estética.

## 2026-07-16 — SEO/AI-SEO del home (metadata real + JSON-LD + limpieza de scaffold)

**Decisión:** el home seguía con metadata de scaffold de Next.js Commerce
(`description: "High-performance ecommerce store built with Next.js,
Vercel, and Shopify."`, sin `openGraph`/`twitter` reales) y `<html lang="en">`
en un sitio 100% en español — se corrigió todo el paquete SEO del home:

- `app/layout.tsx`: `lang="en"` → `lang="es"`, `viewport` export propio,
  `openGraph`/`twitter` de fallback a nivel raíz (`siteName`, `locale:
  "es_MX"`, `card: "summary_large_image"`) para que cualquier página sin
  metadata propia ya herede algo razonable en vez del vacío de antes.
- `app/page.tsx`: `title`/`description` reales orientados a keywords reales
  del catálogo (activewear, leggings, ropa deportiva, mujer/hombre,
  México), `alternates.canonical`, y **3 bloques JSON-LD** (`Organization`
  con el Instagram real como `sameAs`, `WebSite` con `SearchAction` hacia
  `/search?q=`, `ItemList` de los productos de "Lo más nuevo" enlazando a
  cada `/product/[handle]` — sin duplicar precio/disponibilidad ahí, eso
  ya vive en el `Product` schema de la página de producto). Se agregó
  también un párrafo visible (no solo meta/schema) que define la marca en
  una frase — Google AI Overviews prioriza texto extraíble en el DOM, no
  solo metadata.
  **No se inventó ningún dato** (envíos, ubicación física, composición de
  tela) — el párrafo solo usa hechos ya confirmados en el repo (mercado
  México, categorías reales de Shopify, el tagline ya aprobado del hero).
- `app/robots.ts`: se agregó `disallow` para `/api/`, `/cuenta` y
  `/favoritos` (auth-gated / sin contenido indexable para un crawler).
- `app/sitemap.ts`: se agregaron las páginas propias construidas a mano
  (`/contacto`, `/soporte`, `/guia-de-tallas`, `/terminos`, `/privacidad`)
  — antes solo listaba `""` + lo que viene dinámico de Shopify
  (colecciones/productos/`getPages()`).
- **`<ThreeItemGrid />` y `<Carousel />` se quitaron de `app/page.tsx`**
  (no eliminados del repo, solo del home): dependían de las colecciones
  demo `hidden-homepage-featured-items` y `hidden-homepage-carousel` del
  template de Next.js Commerce, que **no existen** en el Shopify real de
  Ago Fitness (verificado contra la Storefront API) — ambos componentes
  renderizaban `null` en producción. Puro peso muerto: dos fetches a la
  Storefront API por carga de página sin ningún contenido a cambio.
- El `<Analytics />` de Vercel (ver `CLAUDE.md`, 16 julio) ya deja medir
  el efecto de estos cambios en tráfico real una vez deployado.

**Pendiente detectado, no corregido (no es código):** el sitemap sigue
trayendo `/contact` y `/search` como páginas de contenido de Shopify
(`getPages()`) — parecen páginas demo en inglés que trae el template por
default en el Admin de Shopify, separadas de las rutas reales `/contacto`
y `/search` de la app. Revisar/borrar en el Admin de Shopify (Online
Store → Pages) si son basura del scaffold — no se tocó porque es contenido
del Admin, no código.

## 2026-07-16 — SEO ronda 2: fallback en inglés en categorías, FAQPage schema, canonical faltante

**Contexto:** se auditó el resto de las páginas indexables del sitio
(colecciones, `/soporte`, páginas legales) buscando el mismo tipo de bug
que el home (metadata rota/heredada del template). Se encontraron 3 cosas
reales, no cosméticas:

1. **`/search/[collection]` caía a `` `${collection.title} products` `` en
   inglés.** Se verificó contra la Storefront API real: de las 11
   colecciones del catálogo, solo `Mujer` y `Hombre` tienen `description`
   capturada en el Admin de Shopify — las otras 9 (Leggings, Tops,
   Chamarras, Faldas, Conjuntos, Shorts Mujer, Playeras, Shorts Hombre,
   Playeras Mujer) están vacías. Esas son justo las páginas de categoría
   que alguien busca como "leggings mujer" o "shorts hombre" — estaban
   sirviendo `<meta name="description">` en inglés tipo "Leggings
   products". Fix en `app/search/[collection]/page.tsx`: fallback en
   español (`Compra {título} en Ago Fitness — activewear diseñado para
   moverse contigo...`) + `alternates.canonical` + `openGraph` (ninguna de
   las dos existía antes). **Pendiente real, no de código:** cargar
   `description`/`seo.title`/`seo.description` reales por colección en el
   Admin de Shopify — el fallback ya no rompe, pero sigue siendo genérico.
2. **`POPULAR_SEARCH_TERMS`** (`lib/constants.ts`) sugería búsquedas en
   inglés y de categorías que Ago Fitness no vende (`sports bra`,
   `running`, `yoga`, `hoodie`, `sneakers`) en un catálogo 100% en español
   sin calzado. Se reemplazó por los 7 tipos de producto reales
   (leggings/playeras/shorts/chamarras/conjuntos/faldas/tops) — cada
   sugerencia ahora devuelve resultados de verdad.
3. **`/soporte` tiene 5 preguntas/respuestas reales** en el acordeón de
   `components/help-center.tsx` (pedidos, cambios/devoluciones, tallas,
   pagos, cuenta) sin ningún `FAQPage` schema — cero oportunidad de rich
   result pese a tener contenido de sobra. Se agregó el JSON-LD en
   `app/soporte/page.tsx`, con el texto de las respuestas espejado 1:1 al
   copy visible del acordeón (Google exige que el schema no invente
   contenido que no esté en la página) — si el copy del acordeón cambia,
   hay que actualizar también `FAQ_JSON_LD_ITEMS` en el page.

De paso se agregó `alternates.canonical` + `openGraph` a `/contacto`,
`/terminos`, `/privacidad` y `/guia-de-tallas` (ninguna de las 5 páginas
estáticas los tenía).

**No se tocó:** las descripciones/SEO de colecciones en el Admin de
Shopify — eso es contenido del cliente, no código; ver punto 1 arriba
para lo que falta ahí si se quiere cerrar del todo.

## 2026-07-16 — SEO ronda 3: BreadcrumbList schema, descripciones de colección en Shopify, limpieza de página fantasma

**Contexto:** cierre de la ronda de SEO — dos partes de código y dos
acciones directas en el Admin de Shopify, estas últimas con autorización
explícita del cliente (el sistema bloquea por default cualquier escritura
directa a Shopify Admin sin confirmación puntual).

1. **`BreadcrumbList` JSON-LD en `/product/[handle]` y
   `/search/[collection]`.** En producto, `breadcrumbFor()` (antes privada
   en `components/product/product-description.tsx`) se exportó para que
   `app/product/[handle]/page.tsx` arme el schema con la misma lógica que
   ya calcula el breadcrumb visible — una sola fuente de verdad, no puede
   desincronizarse. En colección, se agregó `parentGenderFor()` en
   `app/search/[collection]/page.tsx`, que resuelve el género padre de
   cualquier subcategoría recorriendo los `primaryLinks` reales de
   `MEGA_MENU` (misma fuente que arma el mega menu) — verificado en vivo:
   `/search/leggings` → Inicio › Mujer › Leggings.
2. **Corregido un hallazgo erróneo de la ronda 2:** se había señalado
   `/search` como página fantasma de Shopify junto con `/contact` — falso.
   `/search` es una colección sintética "All" que ya arma
   `getCollections()` en `lib/shopify/index.ts` (boilerplate de Next.js
   Commerce, representa "todos los productos"), no contenido de Shopify.
   Se confirmó por GraphQL contra el Admin real que la única página en
   Shopify era **"Contact"** (handle `contact`, en inglés, `body` vacío,
   publicada) — el verdadero leftover del scaffold.
3. **Con autorización explícita del cliente:**
   - Se completaron las 9 descripciones de colección que faltaban (Tops,
     Chamarras, Faldas, Leggings, Conjuntos, Shorts Mujer, Playeras,
     Shorts Hombre, Playeras Mujer) vía `update-collection` — mismo tono
     que ya tenían Mujer/Hombre, sin inventar composición de tela ni
     ninguna claim no confirmada. El fallback en español del código
     (ronda 2) ya no debería activarse en ninguna colección real.
   - Se borró por completo la página "Contact" del Admin de Shopify
     (`pageDelete`, `gid://shopify/Page/165087314212`) — confirmado
     `deletedPageId` sin `userErrors`, y una segunda consulta a `pages`
     devolvió lista vacía.
