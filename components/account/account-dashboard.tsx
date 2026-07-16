"use client";

import { logout } from "app/cuenta/actions";
import AddressesPanel from "components/account/addresses-panel";
import OrdersPanel from "components/account/orders-panel";
import ProfilePanel from "components/account/profile-panel";
import clsx from "clsx";
import type { Customer } from "lib/shopify/types";
import { useState } from "react";

const TABS = [
  { key: "pedidos", label: "Pedidos" },
  { key: "direcciones", label: "Direcciones" },
  { key: "perfil", label: "Perfil" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AccountDashboard({ customer }: { customer: Customer }) {
  const [tab, setTab] = useState<TabKey>("pedidos");
  const fullName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="mx-auto w-full max-w-screen-lg px-4 py-12 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black lg:text-5xl">
            {fullName ? `Hola, ${customer.firstName}` : "Mi cuenta"}
          </h1>
          <p className="mt-2 text-neutral-500">{customer.email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-bold text-black underline underline-offset-2"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <div className="relative mt-8 grid grid-cols-3 rounded-full border border-neutral-200 bg-neutral-50 p-1 sm:inline-grid sm:w-auto">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc((100%-8px)/3)] rounded-full bg-black transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${TABS.findIndex((t) => t.key === tab) * 100}%)`,
          }}
        />
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={clsx(
              "relative z-10 rounded-full px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-0",
              tab === key ? "text-white" : "text-neutral-500 hover:text-black",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "pedidos" ? <OrdersPanel orders={customer.orders} /> : null}
        {tab === "direcciones" ? (
          <AddressesPanel
            addresses={customer.addresses}
            defaultAddressId={customer.defaultAddress?.id ?? null}
          />
        ) : null}
        {tab === "perfil" ? <ProfilePanel customer={customer} /> : null}
      </div>
    </section>
  );
}
