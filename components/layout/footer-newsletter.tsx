"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "app/actions/newsletter";
import FillButton from "components/ui/fill-button";

export default function FooterNewsletter() {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    null,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("¡Gracias por suscribirte!");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div>
      <p className="max-w-sm text-xl font-bold tracking-tight text-black">
        Suscríbete para recibir ofertas exclusivas y ver nuevos productos
        antes que nadie.
      </p>
      <form
        action={formAction}
        key={state?.ok ? "sent" : "idle"}
        className="mt-6 flex max-w-sm items-center rounded-lg bg-neutral-100 p-1.5 ring-1 ring-transparent transition-shadow duration-300 focus-within:ring-[#b48b8c]"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="Correo electrónico"
          autoComplete="email"
          className="w-full bg-transparent px-3.5 py-2 text-sm text-black placeholder:text-neutral-500"
          style={{ outline: "none", boxShadow: "none" }}
        />
        <FillButton type="submit" size="sm" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar"}
        </FillButton>
      </form>
    </div>
  );
}
