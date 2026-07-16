"use client";

import { login, recoverPassword, register } from "app/cuenta/actions";
import clsx from "clsx";
import FillButton from "components/ui/fill-button";
import { useActionState, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-black transition-colors placeholder:text-neutral-400 focus:border-black focus:outline-none";

function RecoverForm({ onDone }: { onDone: () => void }) {
  const [message, formAction] = useActionState(recoverPassword, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm text-neutral-600">
        Escribe tu correo y te enviamos instrucciones para restablecer tu
        contraseña.
      </p>
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Correo electrónico"
        className={inputClass}
      />
      {message ? <p className="text-sm text-neutral-700">{message}</p> : null}
      <FillButton type="submit" className="w-full justify-center">
        Enviar instrucciones
      </FillButton>
      <button
        type="button"
        onClick={onDone}
        className="text-sm font-medium text-neutral-500 hover:text-black"
      >
        Volver a iniciar sesión
      </button>
    </form>
  );
}

function LoginForm() {
  const [error, formAction] = useActionState(login, null);
  const [recovering, setRecovering] = useState(false);

  if (recovering) {
    return <RecoverForm onDone={() => setRecovering(false)} />;
  }

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
      <button
        type="button"
        onClick={() => setRecovering(true)}
        className="self-start text-sm font-medium text-neutral-500 hover:text-black"
      >
        ¿Olvidaste tu contraseña?
      </button>
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

      <div className="relative mt-8 grid grid-cols-2 rounded-full border border-neutral-200 bg-neutral-50 p-1">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-black transition-transform duration-300 ease-out"
          style={{
            transform:
              tab === "register" ? "translateX(100%)" : "translateX(0)",
          }}
        />
        {(["login", "register"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={clsx(
              "relative z-10 flex items-center justify-center whitespace-nowrap rounded-full px-2 py-2.5 text-[11px] font-bold tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-0 sm:px-6 sm:text-sm",
              tab === key ? "text-white" : "text-neutral-500 hover:text-black",
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
