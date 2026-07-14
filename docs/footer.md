# Footer

Archivos: `components/layout/footer.tsx` (server component) +
`components/layout/footer-newsletter.tsx` (client, el único bloque
interactivo). Reemplazó por completo el footer genérico de Next.js Commerce
(que traía branding de Vercel, "Deploy" button, y clases `dark:`).

**Referencia de diseño (13 julio 2026): footer de On Running** — se adaptó
la estructura (declaración de marca grande arriba, newsletter + columnas de
links, sociales en la barra inferior) sin copiar contenido ni assets, solo
el patrón de layout.

## Estructura (de arriba a abajo)

1. **CTA de marca** — fila con el slogan "Feel strong. Live confident." a
   la izquierda y el botón `FillButton` "Conócenos" a la derecha (no es un
   link inline con texto — es un botón real, ver sección FillButton abajo).
2. **Newsletter + columnas** (`grid-cols-[1.5fr_1.6fr]`, con las 3 columnas
   agrupadas en un sub-grid `grid-cols-3 gap-6` dentro de la segunda mitad
   — así el newsletter respira con más espacio y las columnas de links
   quedan juntas entre sí):
   - `FooterNewsletter` (client component): input + `FillButton` "Enviar"
     dentro de un contenedor `bg-neutral-100 rounded-lg` (look tipo Apple,
     sin bordes). Al enviar dispara un toast de `sonner` ("¡Gracias por
     suscribirte!") — **no hay integración real todavía** (no está
     conectado a Klaviyo/Mailchimp/lo que se use), es solo la UI. El
     contenedor tiene un `ring` rosa sutil en `focus-within`.
   - **Tienda:** reutiliza `CATEGORY_LINKS` de `lib/constants.ts` — mismo
     origen de datos que el navbar, no duplicado.
   - **Ayuda:** links estáticos (`HELP_LINKS`) — todos apuntan a `/soporte`
     por ahora.
   - **Empresa:** Nosotros, Contacto, Trabaja con nosotros.
   - Todos los links de columna usan el componente local `FooterLink`
     (subrayado deslizante al hover, mismo patrón que el navbar).
3. **Línea de acento** `#b48b8c` (1px) — mismo color que la barra superior
   del navbar, para amarrar la identidad visual arriba/abajo del sitio.
4. **Bottom bar:** copyright + iconos de redes sociales (fila superior —
   círculo relleno rosa + lift al hover), links legales
   Privacidad/Términos (fila inferior, mismo subrayado deslizante).

## `FillButton` — bug de z-index (13 julio 2026)

El botón "Conócenos" (y "Enviar") usa `components/ui/fill-button.tsx`: un
círculo rosa envuelve la flecha en reposo, y al hover se expande
(`scale-[20]`) hasta cubrir todo el botón, recortado por `overflow-hidden`
en el contenedor.

**Bug:** el texto quedaba tapado por el círculo al expandirse. Causa: texto
y el wrapper de la flecha tenían el **mismo** `z-index` (`z-20`) — en un
empate de `z-index`, el navegador pinta encima al elemento que aparece
después en el DOM (el wrapper de la flecha, que contiene el círculo), sin
importar que ambos digan "20". **Fix:** el texto quedó en `z-30`
(estrictamente mayor que el `z-20` del wrapper de la flecha) — así gana
siempre el orden de pintado, sin depender del orden en el DOM.

## Footer pegado al fondo (`mt-auto`)

Con la tienda vacía, páginas con poco contenido dejaban el footer flotando
a media pantalla en vez de pegado abajo. Fix en `app/layout.tsx`: `body`
es `flex min-h-screen flex-col`, `main` es `flex flex-1 flex-col`, y
`footer.tsx` tiene `mt-auto` — el truco clásico de flexbox: el footer se
pega al fondo del contenedor flex cuando el contenido es corto, y se
comporta normal (footer justo después del contenido) cuando el contenido
ya llena o excede el viewport.

## Pendiente

- `/nosotros`, `/contacto`, `/privacidad`, `/terminos` **no existen como
  páginas todavía** — dan 404. Next.js Commerce trae soporte para páginas
  de Shopify vía `app/[page]/page.tsx`, así que se pueden crear como
  páginas normales en el Admin de Shopify (Online Store → Pages) y
  aparecerán automáticamente en esa ruta.
- Links de redes sociales: **Instagram ya es real**
  (`instagram.com/agofitnessco`). TikTok y Facebook siguen en placeholder
  (`#`) — reemplazar cuando el cliente pase esas URLs.
