"use client";

import {
  makeDefaultAddress,
  removeAddress,
  saveAddress,
} from "app/cuenta/actions";
import FillButton from "components/ui/fill-button";
import { COUNTRIES } from "lib/constants";
import type { CustomerAddress } from "lib/shopify/types";
import { useActionState, useEffect, useRef, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-black transition-colors placeholder:text-neutral-400 focus:border-black focus:outline-none";

function AddressForm({
  address,
  isDefault,
  onDone,
}: {
  address?: CustomerAddress;
  isDefault: boolean;
  onDone: () => void;
}) {
  const [error, formAction, isPending] = useActionState(saveAddress, null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !error) {
      onDone();
    }
    wasPending.current = isPending;
  }, [isPending, error, onDone]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-5"
    >
      {address ? (
        <input type="hidden" name="addressId" value={address.id} />
      ) : null}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          type="text"
          required
          placeholder="Nombre"
          defaultValue={address?.firstName ?? ""}
          className={inputClass}
        />
        <input
          name="lastName"
          type="text"
          required
          placeholder="Apellido"
          defaultValue={address?.lastName ?? ""}
          className={inputClass}
        />
      </div>
      <input
        name="address1"
        type="text"
        required
        placeholder="Calle y número"
        defaultValue={address?.address1 ?? ""}
        className={inputClass}
      />
      <input
        name="address2"
        type="text"
        placeholder="Interior, colonia (opcional)"
        defaultValue={address?.address2 ?? ""}
        className={inputClass}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          name="city"
          type="text"
          required
          placeholder="Ciudad"
          defaultValue={address?.city ?? ""}
          className={inputClass}
        />
        <input
          name="province"
          type="text"
          required
          placeholder="Estado"
          defaultValue={address?.province ?? ""}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="zip"
          type="text"
          required
          placeholder="Código postal"
          defaultValue={address?.zip ?? ""}
          className={inputClass}
        />
        <input
          name="phone"
          type="tel"
          placeholder="Teléfono (opcional)"
          defaultValue={address?.phone ?? ""}
          className={inputClass}
        />
      </div>
      <select
        name="country"
        required
        defaultValue={address?.country ?? "México"}
        className={inputClass}
      >
        {/* Si una dirección existente ya trae un país fuera de la lista
            curada, lo agregamos como opción extra en vez de perderlo al
            guardar. */}
        {address?.country && !COUNTRIES.includes(address.country) ? (
          <option value={address.country}>{address.country}</option>
        ) : null}
        {COUNTRIES.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input
          type="checkbox"
          name="setDefault"
          defaultChecked={isDefault}
          className="h-4 w-4 rounded border-neutral-300"
        />
        Usar como dirección predeterminada
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-4">
        <FillButton type="submit" size="sm">
          Guardar
        </FillButton>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-medium text-neutral-500 hover:text-black"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function DeleteAddressButton({ addressId }: { addressId: string }) {
  const [error, formAction] = useActionState(removeAddress, null);
  const boundAction = formAction.bind(null, addressId);

  return (
    <form action={boundAction}>
      <button
        type="submit"
        className="text-sm font-medium text-neutral-500 hover:text-red-600"
      >
        Eliminar
      </button>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </form>
  );
}

function MakeDefaultButton({ addressId }: { addressId: string }) {
  const [error, formAction] = useActionState(makeDefaultAddress, null);
  const boundAction = formAction.bind(null, addressId);

  return (
    <form action={boundAction}>
      <button
        type="submit"
        className="text-sm font-medium text-neutral-500 hover:text-black"
      >
        Hacer predeterminada
      </button>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </form>
  );
}

function addressLines(address: CustomerAddress): string[] {
  return [
    `${address.firstName ?? ""} ${address.lastName ?? ""}`.trim(),
    address.address1,
    address.address2,
    [address.city, address.province, address.zip].filter(Boolean).join(", "),
    address.country,
    address.phone,
  ].filter((line): line is string => Boolean(line && line.trim()));
}

export default function AddressesPanel({
  addresses,
  defaultAddressId,
}: {
  addresses: CustomerAddress[];
  defaultAddressId: string | null;
}) {
  const [editing, setEditing] = useState<CustomerAddress | "new" | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {addresses.length === 0 ? (
        <p className="text-neutral-500">
          Todavía no tienes direcciones guardadas.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="rounded-lg border border-neutral-200 p-5"
            >
              {address.id === defaultAddressId ? (
                <span className="mb-2 inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-neutral-600 uppercase">
                  Predeterminada
                </span>
              ) : null}
              <div className="text-sm leading-relaxed text-neutral-700">
                {addressLines(address).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setEditing(address)}
                  className="text-sm font-medium text-neutral-500 hover:text-black"
                >
                  Editar
                </button>
                {address.id !== defaultAddressId ? (
                  <MakeDefaultButton addressId={address.id} />
                ) : null}
                <DeleteAddressButton addressId={address.id} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing ? (
        <AddressForm
          address={editing === "new" ? undefined : editing}
          isDefault={editing !== "new" && editing.id === defaultAddressId}
          onDone={() => setEditing(null)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="self-start text-sm font-bold text-black underline underline-offset-2"
        >
          + Agregar dirección
        </button>
      )}
    </div>
  );
}
