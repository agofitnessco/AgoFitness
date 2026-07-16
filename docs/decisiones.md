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
