# Cuenta de cliente (`/cuenta`)

> Construido julio 2026. Login, registro, perfil, historial de pedidos y
> direcciones guardadas — 100% custom con la estética del sitio (sin
> redirect al login hosteado de Shopify).

## Por qué es posible construirlo custom

Antes de empezar se confirmó contra el Storefront API real de la tienda
(introspección de schema + un intento de login con credenciales
inventadas) que **Ago Fitness todavía usa el sistema clásico de cuentas de
cliente de Shopify**, no las "New Customer Accounts" (que son OAuth-only y
no dejan hacer un formulario de login propio). Esto significa que las
mutations clásicas del Storefront API (`customerAccessTokenCreate`,
`customerCreate`, `customerAddressCreate`, etc.) funcionan tal cual —
si el cliente migra a New Customer Accounts en el futuro, todo este flujo
dejaría de funcionar y habría que rehacerlo con el flujo OAuth nuevo.

**Versión de API:** se verificaron los campos usados (`Order.statusUrl`,
`MailingAddressInput`, etc.) contra `SHOPIFY_GRAPHQL_API_ENDPOINT`
(`2023-01`, la que usa realmente `lib/shopify/index.ts`) — no contra una
versión más nueva.

## Mapa de archivos

```
lib/shopify/
  queries/customer.ts       → getCustomerQuery (customer + addresses + orders)
  mutations/customer.ts     → access token create/delete, customer create,
                               address create/update/delete, default address
  types.ts                  → Customer, CustomerAddress, Order, + Shopify*Operation
  index.ts                  → funciones de alto nivel: loginCustomer,
                               registerCustomer, deleteCustomerAccessToken,
                               getCustomer, create/update/deleteCustomerAddress,
                               setDefaultCustomerAddress (todas SIN "use cache" —
                               son datos personalizados, nunca deben cachearse
                               entre usuarios)

app/cuenta/
  page.tsx                  → Server Component. Lee la cookie customerToken;
                               sin token o token inválido → <AuthPanel />,
                               con token válido → <AccountDashboard />
  actions.ts                → Server Actions: login, register, logout,
                               saveAddress, removeAddress, makeDefaultAddress

components/account/
  auth-panel.tsx             → tabs Entrar/Crear cuenta (mismo patrón de
                                pills que SizeGuide)
  account-dashboard.tsx      → tabs Pedidos/Direcciones/Perfil + logout
  orders-panel.tsx           → historial de pedidos (Server Component, sin
                                interactividad)
  addresses-panel.tsx        → CRUD de direcciones (client, formularios +
                                Server Actions)
```

## Sesión — cookie `customerToken`

Mismo patrón que `cartId` para el carrito (`components/cart/actions.ts`):
el `customerAccessToken` que devuelve Shopify se guarda en una cookie
**httpOnly** (`lib/constants.ts` → `CUSTOMER_TOKEN_COOKIE`), con
`expires` igual al `expiresAt` que devuelve Shopify (normalmente 24h).
`secure: true` solo en producción (para poder probar en `localhost` sin
HTTPS). Nunca se expone el token al cliente — todas las mutations que lo
necesitan corren en Server Actions.

**Login automático tras registro:** `register()` en `actions.ts` llama
`customerCreate` y, si sale bien, inmediatamente llama `loginCustomer()`
para obtener el token y setear la cookie — sin este paso el cliente
tendría que volver a escribir sus credenciales justo después de crear la
cuenta.

**Token inválido/expirado:** `page.tsx` simplemente cae a `<AuthPanel />`
si `getCustomer(token)` devuelve `undefined` — no hay lógica extra para
limpiar la cookie vieja (se sobreescribe sola en el próximo login). No se
implementó "recordarme"/refresh de token — al expirar, el cliente
simplemente tiene que volver a iniciar sesión.

## Direcciones — patrón de formulario reusado para crear y editar

`AddressForm` (`addresses-panel.tsx`) es el mismo componente para "nueva
dirección" y "editar dirección": si recibe `address` prop, agrega un
`<input type="hidden" name="addressId">` y `saveAddress()` en el server
decide `createCustomerAddress` vs `updateCustomerAddress` según si ese
campo viene o no en el `FormData`.

**Cierre automático del formulario al guardar:** usa el tercer valor de
`useActionState` (`isPending`) en vez de intentar `await` el dispatcher de
la action (que no es awaitable de forma confiable) — un `useEffect`
detecta la transición `isPending: true → false` sin error y ahí sí cierra
el formulario (`onDone()`). Ver el patrón exacto en el componente si se
reutiliza en otro lado.

**País fijo a "México":** no hay selector de país — se manda como
`<input type="hidden">`. Simplificación honesta para el alcance actual
(la tienda no tiene envíos internacionales confirmados); si eso cambia,
agregar un `<select>` real en vez de inventar opciones.

## Pedidos

`OrdersPanel` es un Server Component puro (no necesita interactividad) —
lista `customer.orders` con imagen+título+cantidad por línea, estado
(`fulfillmentStatus` traducido vía `STATUS_LABELS`) y un link real a
`order.statusUrl` (la página de estado del pedido que hostea Shopify) —
no se construyó una página de tracking propia, se linkea a la real.

## No fabricado / pendiente

- Sin recuperación de contraseña (`customerRecover`) — no estaba en el
  alcance pedido; si se agrega, es la misma mutation family, mismo patrón.
- Sin edición de nombre/email/teléfono del perfil (`customerUpdate`) — el
  tab "Perfil" es de solo lectura por ahora.
- Sin selector de país en direcciones (fijo a México, ver arriba).
- El link "Mi cuenta" ya existía en `navbar-shell.tsx` y
  `mobile-nav-bar.tsx` apuntando a `/cuenta` — no se tocó, ya resuelve
  solo con que la página exista.
