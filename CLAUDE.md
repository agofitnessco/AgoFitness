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
- Pendiente: crear colecciones reales en Shopify (`mujer`, `hombre`, `ninos`)
  para que los links de categoría dejen de dar 404, cargar productos de
  prueba, y seguir con el resto del home (hero, grid de productos).
