"use server";

import { Resend } from "resend";

/**
 * Suscripción al newsletter del footer — usa Resend Audiences (no Shopify
 * Admin API). Más simple que crear una app aparte en Shopify con scope
 * write_customers: reutiliza el mismo RESEND_API_KEY que ya usa el
 * formulario de contacto, solo que con permiso "Full access" (el de
 * "Sending access" no puede crear/leer audiencias ni contactos).
 *
 * Los correos capturados aquí viven en Resend (Audiences → mandas
 * campañas desde ahí), no como clientes de Shopify — si en algún momento
 * se necesita cruzar "suscritos al newsletter" con "compraron algo", esa
 * unión ya no es automática, quedaría pendiente si se necesita.
 */

export type NewsletterState = {
  ok: boolean;
  error: string | null;
} | null;

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Escribe un correo válido." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error(
      "RESEND_API_KEY o RESEND_NEWSLETTER_AUDIENCE_ID no están configuradas — no se pudo suscribir al newsletter.",
    );
    return {
      ok: false,
      error: "El newsletter no está conectado todavía. Intenta más tarde.",
    };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    audienceId,
  });

  if (error) {
    console.error("Resend contacts.create error:", error);
    return {
      ok: false,
      error: "No se pudo procesar tu suscripción. Intenta de nuevo.",
    };
  }

  return { ok: true, error: null };
}
