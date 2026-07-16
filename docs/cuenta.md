# Cuenta de cliente (`/cuenta`)

> Construido julio 2026. Login, registro, recuperar contraseña, editar
> perfil, historial de pedidos y direcciones guardadas (con selector de
> país) — 100% custom con la estética del sitio (sin redirect al login
> hosteado de Shopify).

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
                               recoverPassword, updateProfile, saveAddress,
                               removeAddress, makeDefaultAddress

components/account/
  auth-panel.tsx             → tabs Entrar/Crear cuenta con indicador
                                deslizante negro + "¿Olvidaste tu
                                contraseña?" (RecoverForm inline dentro de
                                LoginForm)
  account-dashboard.tsx      → tabs Pedidos/Direcciones/Perfil (mismo
                                indicador deslizante) + logout
  orders-panel.tsx           → historial de pedidos (Server Component, sin
                                interactividad)
  addresses-panel.tsx        → CRUD de direcciones con selector de país
                                (client, formularios + Server Actions)
  profile-panel.tsx          → editar nombre/apellido/teléfono (correo de
                                solo lectura, ver abajo)
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

**Selector de país:** `lib/constants.ts` → `COUNTRIES` (México primero,
luego el resto de Latam + EUA/Canadá/España). No hace falta limitarlo a
"lo que ya envía la tienda" para ser honesto — `MailingAddressInput` de
Shopify solo guarda el nombre del país, la validación de zonas de envío
pasa después, en el checkout, no al guardar la dirección. Si una
dirección existente ya trae un país fuera de la lista curada, el
`<select>` lo agrega como opción extra en vez de perderlo/sobreescribirlo
silenciosamente al guardar.

## Pedidos

`OrdersPanel` es un Server Component puro (no necesita interactividad) —
lista `customer.orders` con imagen+título+cantidad por línea, estado
(`fulfillmentStatus` traducido vía `STATUS_LABELS`) y un link real a
`order.statusUrl` (la página de estado del pedido que hostea Shopify) —
no se construyó una página de tracking propia, se linkea a la real.

## Recuperar contraseña (`customerRecover`)

`RecoverForm` vive dentro de `LoginForm` (toggle local, no una ruta
aparte) — pide solo el correo. **Decisión de seguridad:** Shopify sí
distingue si el correo existe o no (`customerRecover` devuelve
`UNIDENTIFIED_CUSTOMER` para un correo que no existe, confirmado por
introspección/prueba en vivo), pero `recoverPassword()` en `actions.ts`
**siempre devuelve el mismo mensaje neutro**
("Si el correo está registrado, te enviamos instrucciones...") sin
importar el resultado real — no hay razón para amplificar en nuestra
propia UI una fuga de información que ya existe en el API.

## Editar perfil (`customerUpdate`)

`ProfilePanel` edita nombre/apellido/teléfono. **El correo es de solo
lectura a propósito** — cambiar el email de un cliente en Shopify puede
rotar su `customerAccessToken` y requiere manejo extra (reautenticación),
se dejó fuera del alcance para no complicar el flujo de sesión. Si
`customerUpdate` devuelve un `customerAccessToken` nuevo (pasa cuando
Shopify decide rotarlo — no debería ocurrir editando solo nombre/teléfono,
pero se maneja por si acaso) la cookie se actualiza en el mismo Server
Action.

## Indicador deslizante en los tabs (julio 2026)

Los toggles de `AuthPanel` (Entrar/Crear cuenta) y `AccountDashboard`
(Pedidos/Direcciones/Perfil) reemplazaron el patrón simple de
`SizeGuide` (fondo negro condicional por botón) por un `<span>` absoluto
que se desliza con `transition-transform` detrás del tab activo — más
pulido, sin el "salto" de que un botón cambie de fondo sin transición.

**Bug de foco corregido:** el `ring` de foco global del sitio
(`a, input, button { focus-visible:ring-2 ring-neutral-400
ring-offset-2 ring-offset-white }`, en `app/globals.css`) se veía como un
halo gris grueso sobre el pill negro (el `ring-offset-white` deja un
hueco blanco entre el borde del botón y el anillo gris — muy visible
contra `bg-black`). Los botones de tab ahora usan
`focus-visible:ring-black/25 focus-visible:ring-offset-0` en vez del
default, para que el foco siga siendo visible (accesibilidad) pero sin el
choque de color.

## No fabricado / pendiente

- El link "Mi cuenta" ya existía en `navbar-shell.tsx` y
  `mobile-nav-bar.tsx` apuntando a `/cuenta` — no se tocó, ya resuelve
  solo con que la página exista.
- Sin edición de correo/contraseña desde el perfil (ver arriba).
