# Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router, Turbopack en dev) |
| UI | React 19 |
| Estilos | Tailwind CSS 4 |
| Componentes headless | `@headlessui/react`, `@heroicons/react` |
| Fuente | `geist` (Vercel) — reemplazar/ampliar según branding de Ago Fitness |
| Notificaciones/toast | `sonner` |
| Animación | `gsap` (incluye el plugin `Flip`, gratis desde que Webflow liberó todos los plugins de club en 2025) — ver [`navbar.md`](navbar.md) |
| Backend de comercio | Shopify (Storefront API, GraphQL) — ver [`shopify.md`](shopify.md) |
| Hosting | Vercel |
| Package manager | npm (el template viene armado para pnpm — se migró a npm por consistencia con el resto de los proyectos) |

## Estructura de carpetas (heredada de Next.js Commerce)

```
app/            → rutas (App Router): home, producto, colección, carrito, búsqueda
components/     → componentes UI reutilizables (grid de producto, carrito, nav)
components/ui/  → componentes genéricos compartidos entre secciones (ej. FillButton)
lib/            → cliente de Shopify (Storefront API), tipos, utils
fonts/          → fuentes locales
public/imgs/    → assets estáticos (logo real de Ago Fitness, etc.)
docs/           → esta documentación
_archive-liquid-theme/  → theme Liquid original (Skeleton), sin uso — solo referencia
```

## Componentes UI compartidos

- **`FillButton`** (`components/ui/fill-button.tsx`): botón/link con un
  círculo `#b48b8c` que envuelve la flecha en reposo y se expande hasta
  cubrir todo el botón al hover (`scale` + `overflow-hidden`, clipping por
  el contenedor). Usado en el CTA "Conócenos" y el botón "Enviar" del
  newsletter del footer — **reutilizar este componente** para cualquier
  CTA nuevo en vez de crear un botón desde cero, para mantener consistencia
  visual. Detalle de la implementación (incluyendo el bug de z-index que se
  corrigió) en [`footer.md`](footer.md).

## Notas de instalación

- El `npx create-next-app` inicial falló por un conflicto de peer dependency
  (`next` canary vs `geist`) — se resolvió con `npm install --legacy-peer-deps`.
  Si se reinstala desde cero (`rm -rf node_modules && npm install`), puede que
  haga falta repetir la flag `--legacy-peer-deps`.
- Se borró `pnpm-lock.yaml` (el template lo trae por defecto) para evitar
  confusión — el proyecto usa `package-lock.json`/npm.
