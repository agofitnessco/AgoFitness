"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="relative w-40 lg:w-56">
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Buscar"
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="w-full border-b border-neutral-300 bg-transparent py-1.5 pr-6 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none focus-visible:outline-none focus-visible:ring-0"
        style={{ outline: "none", boxShadow: "none" }}
      />
      <div className="absolute right-0 top-0 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-neutral-500" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-40 lg:w-56">
      <input
        placeholder="Buscar"
        className="w-full border-b border-neutral-300 bg-transparent py-1.5 pr-6 text-sm text-black placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-neutral-500" />
      </div>
    </form>
  );
}
