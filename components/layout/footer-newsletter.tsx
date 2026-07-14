"use client";

import { useState } from "react";
import { toast } from "sonner";
import FillButton from "components/ui/fill-button";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("¡Gracias por suscribirte!");
    setEmail("");
  };

  return (
    <div>
      <p className="max-w-sm text-xl font-bold tracking-tight text-black">
        Suscríbete para recibir ofertas exclusivas y ver nuevos productos
        antes que nadie.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex max-w-sm items-center rounded-lg bg-neutral-100 p-1.5 ring-1 ring-transparent transition-shadow duration-300 focus-within:ring-[#b48b8c]"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          autoComplete="email"
          className="w-full bg-transparent px-3.5 py-2 text-sm text-black placeholder:text-neutral-500"
          style={{ outline: "none", boxShadow: "none" }}
        />
        <FillButton type="submit" size="sm">
          Enviar
        </FillButton>
      </form>
    </div>
  );
}
