"use server";

/**
 * Suscripción al newsletter del footer — a diferencia del formulario de
 * contacto (Resend), esto usa el sistema nativo de Shopify: crea/actualiza
 * un Customer con `emailMarketingConsentState: SUBSCRIBED`. No hace falta
 * ningún servicio externo — las campañas se mandan gratis desde Shopify
 * Email, y el correo queda visible en Clientes → segmento "suscritos a
 * marketing por correo electrónico".
 *
 * Usa el Admin API (no el Storefront API) porque `customerCreate` de
 * Storefront exige contraseña — crearía una cuenta de login completa, que
 * no es lo que queremos para un simple "avísame de novedades". El Admin
 * API sí permite un cliente sin contraseña, solo con el consentimiento.
 */

export type NewsletterState = {
  ok: boolean;
  error: string | null;
} | null;

const ADMIN_API_VERSION = "2025-01";

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Escribe un correo válido." };
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

  if (!domain || !token) {
    console.error(
      "SHOPIFY_ADMIN_API_ACCESS_TOKEN no está configurada — no se pudo suscribir al newsletter.",
    );
    return {
      ok: false,
      error: "El newsletter no está conectado todavía. Intenta más tarde.",
    };
  }

  const query = `
    mutation SubscribeNewsletter($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer { id }
        userErrors { field message }
      }
    }
  `;

  const res = await fetch(
    `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            email,
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN",
            },
          },
        },
      }),
    },
  );

  if (!res.ok) {
    console.error("Shopify Admin API error:", res.status, await res.text());
    return {
      ok: false,
      error: "No se pudo procesar tu suscripción. Intenta de nuevo.",
    };
  }

  const json = await res.json();
  const userErrors = json?.data?.customerCreate?.userErrors as
    | { field: string[]; message: string }[]
    | undefined;

  // Si el email ya existe como cliente, Shopify regresa un userError de
  // "Email has already been taken" — no es un error real para el usuario,
  // solo significa que ya estaba en la lista (o es cliente por otra
  // razón). En ese caso lo tratamos como éxito silencioso.
  const alreadyExists = userErrors?.some((e) =>
    e.message.toLowerCase().includes("ya se ha tomado") ||
    e.message.toLowerCase().includes("already been taken"),
  );

  if (userErrors && userErrors.length > 0 && !alreadyExists) {
    console.error("Shopify customerCreate userErrors:", userErrors);
    return {
      ok: false,
      error: "No se pudo procesar tu suscripción. Intenta de nuevo.",
    };
  }

  return { ok: true, error: null };
}
