"use client";

import { login, register } from "app/cuenta/actions";
import clsx from "clsx";
import FillButton from "components/ui/fill-button";
import { useActionState, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-black transition-colors placeholder:text-neutral-400 focus:border-black focus:outline-none";

function LoginForm() {
  const [error, formAction] = useActionState(login, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Correo electrónico"
        className={inputClass}
      />
      <input
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Contraseña"
        className={inputClass}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <FillButton type="submit" className="w-full justify-center">
        Entrar
      </FillButton>
    </form>
  );
}

function RegisterForm() {
  const [error, formAction] = useActionState(register, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          placeholder="Nombre"
          className={inputClass}
        />
        <input
          name="lastName"
          type="text"
          required
          autoComplete="family-name"
          placeholder="Apellido"
          className={inputClass}
        />
      </div>
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Correo electrónico"
        className={inputClass}
      />
      <input
        name="password"
        type="password"
        required
        minLength={5}
        autoComplete="new-password"
        placeholder="Contraseña (mínimo 5 caracteres)"
        className={inputClass}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <FillButton type="submit" className="w-full justify-center">
        Crear cuenta
      </FillButton>
    </form>
  );
}

export default function AuthPanel() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <section className="mx-auto w-full max-w-md px-4 py-20 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-black lg:text-5xl">
        Mi cuenta
      </h1>
      <p className="mt-4 text-neutral-600">
        Inicia sesión para ver tus pedidos, direcciones guardadas y más.
      </p>

      <div className="mt-8 inline-flex rounded-full border border-neutral-200 bg-neutral-50 p-1">
        {(["login", "register"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={clsx(
              "rounded-full px-6 py-2 text-sm font-bold tracking-wide uppercase transition-colors",
              tab === key
                ? "bg-black text-white"
                : "text-neutral-500 hover:text-black",
            )}
          >
            {key === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </section>
  );
}
