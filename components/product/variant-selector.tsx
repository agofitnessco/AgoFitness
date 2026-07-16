"use client";

import clsx from "clsx";
import { colorHex, productGradient } from "lib/color-placeholder";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return options.map((option) => {
    const optionNameLowerCase = option.name.toLowerCase();
    const isColor = optionNameLowerCase === "color";
    const isSize = optionNameLowerCase === "talla";
    const selectedValue = searchParams.get(optionNameLowerCase) ?? option.values[0];

    return (
      <form key={option.id}>
        <dl className="mb-6">
          <dt className="mb-3 flex items-center justify-between text-xs font-bold tracking-[0.16em] text-neutral-500 uppercase">
            <span>
              {option.name}
              {isColor && selectedValue ? (
                <span className="ml-1 font-normal normal-case text-black">
                  : {selectedValue}
                </span>
              ) : null}
            </span>
            {isSize ? (
              <Link
                href="/guia-de-tallas"
                className="font-medium normal-case tracking-normal text-neutral-500 underline underline-offset-2 hover:text-black"
              >
                Guía de tallas
              </Link>
            ) : null}
          </dt>
          <dd
            className={
              isSize
                ? "grid grid-cols-4 gap-2 sm:grid-cols-5"
                : "flex flex-wrap gap-2.5"
            }
          >
            {option.values.map((value) => {
              // Base option params on current searchParams so we can preserve any other param state.
              const optionParams: Record<string, string> = {};
              searchParams.forEach((v, k) => (optionParams[k] = v));
              optionParams[optionNameLowerCase] = value;

              // Filter out invalid options and check if the option combination is available for sale.
              const filtered = Object.entries(optionParams).filter(
                ([key, value]) =>
                  options.find(
                    (option) =>
                      option.name.toLowerCase() === key &&
                      option.values.includes(value),
                  ),
              );
              const isAvailableForSale = combinations.find((combination) =>
                filtered.every(
                  ([key, value]) =>
                    combination[key] === value && combination.availableForSale,
                ),
              );

              // The option is active if it's in the selected options.
              const isActive = searchParams.get(optionNameLowerCase) === value;

              if (isColor) {
                const hex = colorHex(value);
                return (
                  <button
                    key={value}
                    formAction={() => updateOption(optionNameLowerCase, value)}
                    aria-disabled={!isAvailableForSale}
                    disabled={!isAvailableForSale}
                    aria-label={`Color ${value}${!isAvailableForSale ? " (agotado)" : ""}`}
                    title={value}
                    className={clsx(
                      "h-14 w-14 overflow-hidden rounded-md border transition-shadow disabled:cursor-not-allowed disabled:opacity-30",
                      isActive
                        ? "border-black ring-1 ring-black"
                        : "border-black/10",
                    )}
                    style={{ backgroundImage: productGradient(hex) }}
                  />
                );
              }

              return (
                <button
                  formAction={() => updateOption(optionNameLowerCase, value)}
                  key={value}
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  title={`${option.name} ${value}${!isAvailableForSale ? " (agotado)" : ""}`}
                  className={clsx(
                    "flex items-center justify-center border text-sm font-medium transition-colors",
                    isSize ? "rounded-md px-2 py-3" : "min-w-11 rounded-full px-3 py-1.5",
                    {
                      "border-black bg-black text-white": isActive,
                      "border-neutral-300 text-black hover:border-black":
                        !isActive && isAvailableForSale,
                      "cursor-not-allowed border-neutral-200 text-neutral-300":
                        !isAvailableForSale,
                    },
                  )}
                >
                  {value}
                </button>
              );
            })}
          </dd>
        </dl>
      </form>
    );
  });
}
