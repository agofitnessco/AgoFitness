"use client";

import { sendContactMessage, type ContactState } from "app/contacto/actions";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import FillButton from "components/ui/fill-button";
import { useActionState, useMemo, useState } from "react";

const MOTIVOS: { label: string; submotivos: string[] }[] = [
  {
    label: "Estado de mi pedido",
    submotivos: [
      "Aún no ha llegado",
      "Llegó incompleto o dañado",
      "Quiero cambiar la dirección de envío",
    ],
  },
  {
    label: "Cambios y devoluciones",
    submotivos: [
      "Quiero cambiar de talla",
      "Quiero una devolución",
      "No sé cómo empezar el proceso",
    ],
  },
  {
    label: "Talla y ajuste de producto",
    submotivos: ["Dudas antes de comprar", "El producto no me quedó como esperaba"],
  },
  {
    label: "Pagos y facturación",
    submotivos: [
      "Problema al pagar",
      "Necesito una factura",
      "Cargo duplicado o incorrecto",
    ],
  },
  {
    label: "Trabaja con nosotros",
    submotivos: ["Vacantes", "Propuesta de colaboración o marca"],
  },
  { label: "Otro", submotivos: [] },
];

const selectClass =
  "w-full appearance-none rounded-lg bg-neutral-100 pl-4 pr-9 pt-6 pb-2.5 text-base font-medium text-black transition-shadow focus:outline-none";

const fieldClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-base text-black transition-colors placeholder:text-neutral-400 focus:border-black focus:outline-none";

function SelectField({
  label,
  value,
  onChange,
  options,
  name,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  name: string;
}) {
  return (
    <div className="relative">
      <label className="pointer-events-none absolute top-2 left-4 right-9 truncate text-[11px] font-bold tracking-wide text-neutral-500 uppercase">
        {label}
      </label>
      <select
        name={name}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          selectClass,
          "ring-1 ring-transparent focus:ring-[#b48b8c]",
          !value && "text-neutral-400",
        )}
      >
        <option value="" disabled>
          Selecciona una opción
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}

const initialState: ContactState = null;

export default function ContactForm() {
  const [motivo, setMotivo] = useState("");
  const [submotivo, setSubmotivo] = useState("");
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  const submotivos = useMemo(
    () => MOTIVOS.find((m) => m.label === motivo)?.submotivos ?? [],
    [motivo],
  );

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center">
        <p className="text-lg font-bold text-black">¡Mensaje enviado!</p>
        <p className="mt-2 text-sm text-neutral-600">
          Gracias por escribirnos — te respondemos a tu correo en menos de 24
          horas.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        formData.set("motivo", motivo);
        formData.set("submotivo", submotivo);
        formAction(formData);
      }}
      className="flex flex-col gap-4"
    >
      <SelectField
        label="Cuéntanos el motivo de tu consulta"
        name="motivo"
        value={motivo}
        onChange={(v) => {
          setMotivo(v);
          setSubmotivo("");
        }}
        options={MOTIVOS.map((m) => m.label)}
      />

      {submotivos.length > 0 ? (
        <SelectField
          label="¿Puedes especificar un poco más?"
          name="submotivo"
          value={submotivo}
          onChange={setSubmotivo}
          options={submotivos}
        />
      ) : null}

      {motivo ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              name="name"
              type="text"
              required
              placeholder="Tu nombre"
              autoComplete="name"
              className={fieldClass}
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Tu correo electrónico"
              autoComplete="email"
              className={fieldClass}
            />
          </div>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Cuéntanos con detalle en qué te ayudamos"
            className={clsx(fieldClass, "resize-none")}
          />
          {state?.error ? (
            <p className="text-sm text-red-600">{state.error}</p>
          ) : null}
          <FillButton
            type="submit"
            disabled={isPending}
            className="justify-center sm:self-start"
          >
            {isPending ? "Enviando…" : "Enviar mensaje"}
          </FillButton>
        </>
      ) : null}
    </form>
  );
}
