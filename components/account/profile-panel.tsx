"use client";

import { updateProfile } from "app/cuenta/actions";
import FillButton from "components/ui/fill-button";
import type { Customer } from "lib/shopify/types";
import { useActionState, useEffect, useRef, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-black transition-colors placeholder:text-neutral-400 focus:border-black focus:outline-none";

export default function ProfilePanel({ customer }: { customer: Customer }) {
  const [error, formAction, isPending] = useActionState(updateProfile, null);
  const [justSaved, setJustSaved] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending) {
      setJustSaved(!error);
    }
    wasPending.current = isPending;
  }, [isPending, error]);

  return (
    <form
      action={formAction}
      className="flex max-w-sm flex-col gap-4 rounded-lg border border-neutral-200 p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          type="text"
          required
          placeholder="Nombre"
          defaultValue={customer.firstName ?? ""}
          className={inputClass}
        />
        <input
          name="lastName"
          type="text"
          required
          placeholder="Apellido"
          defaultValue={customer.lastName ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold tracking-wide text-neutral-500 uppercase">
          Correo
        </label>
        <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
          {customer.email}
        </p>
      </div>

      <input
        name="phone"
        type="tel"
        placeholder="Teléfono (opcional)"
        defaultValue={customer.phone ?? ""}
        className={inputClass}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {justSaved ? (
        <p className="text-sm text-neutral-500">Cambios guardados.</p>
      ) : null}

      <FillButton type="submit" size="sm" className="self-start">
        Guardar cambios
      </FillButton>
    </form>
  );
}
