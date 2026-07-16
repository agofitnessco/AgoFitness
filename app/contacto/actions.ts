"use server";

import { Resend } from "resend";

export type ContactState = {
  ok: boolean;
  error: string | null;
} | null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const motivo = String(formData.get("motivo") ?? "").trim();
  const submotivo = String(formData.get("submotivo") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !motivo || !message) {
    return { ok: false, error: "Faltan campos por completar." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "RESEND_API_KEY no está configurada — no se pudo enviar el mensaje de contacto.",
    );
    return {
      ok: false,
      error:
        "El formulario no está conectado todavía. Escríbenos directamente a hola@agofitness.com mientras tanto.",
    };
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM_EMAIL ?? "Ago Fitness <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL ?? "hola@agofitness.com";

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `[Contacto] ${motivo}${submotivo ? ` — ${submotivo}` : ""}`,
    html: `
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
      <p><strong>Motivo:</strong> ${escapeHtml(motivo)}</p>
      ${submotivo ? `<p><strong>Detalle:</strong> ${escapeHtml(submotivo)}</p>` : ""}
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return {
      ok: false,
      error: "No se pudo enviar tu mensaje. Intenta de nuevo en unos minutos.",
    };
  }

  return { ok: true, error: null };
}
