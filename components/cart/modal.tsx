"use client";

import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import BagIcon from "components/icons/bag";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

/**
 * Botón que abre el carrito — se monta dos veces (navbar desktop y barra
 * móvil), pero el panel (`CartPanel`) vive una sola vez en `navbar-shell.tsx`
 * y comparte el estado `isCartOpen` vía `CartContext`. Antes cada instancia
 * tenía su propio `useState` + su propio `<Dialog>`, así que al agregar un
 * producto ambas se auto-abrían a la vez (dos overlays encimados, había que
 * cerrar dos veces) — ver docs/tienda.md.
 */
export default function CartModal({ transparent }: { transparent?: boolean }) {
  const { cart, isCartOpen, openCart } = useCart();
  const quantityRef = useRef(cart?.totalQuantity);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isCartOpen) {
        openCart();
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isCartOpen, cart?.totalQuantity, quantityRef, openCart]);

  return (
    <button aria-label="Open cart" onClick={openCart}>
      <OpenCart quantity={cart?.totalQuantity} transparent={transparent} />
    </button>
  );
}

/**
 * El panel del carrito (Dialog) — montar UNA sola vez (en `navbar-shell.tsx`),
 * nunca junto a cada `CartModal`.
 */
export function CartPanel() {
  const { cart, updateCartItem, isCartOpen, closeCart } = useCart();

  return (
    <Transition show={isCartOpen}>
      <Dialog onClose={closeCart} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-[.5px]"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="opacity-100 backdrop-blur-[.5px]"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/95 p-6 text-black backdrop-blur-xl md:w-[390px]">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium uppercase tracking-[0.14em]">
                Carrito
              </p>
              <button aria-label="Close cart" onClick={closeCart}>
                <CloseCart />
              </button>
            </div>

            {!cart || cart.lines.length === 0 ? (
              <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                <BagIcon className="h-16 w-16" strokeWidth={1.5} />
                <p className="mt-6 text-center text-2xl font-bold">
                  Tu carrito está vacío.
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                <ul className="grow overflow-auto py-4">
                  {cart.lines
                    .sort((a, b) =>
                      a.merchandise.product.title.localeCompare(
                        b.merchandise.product.title,
                      ),
                    )
                    .map((item, i) => {
                      const merchandiseSearchParams =
                        {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(
                        ({ name, value }) => {
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[name.toLowerCase()] = value;
                          }
                        },
                      );

                      const merchandiseUrl = createUrl(
                        `/product/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams),
                      );

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-200"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -ml-1 -mt-2">
                              <DeleteItemButton
                                item={item}
                                optimisticUpdate={updateCartItem}
                              />
                            </div>
                            <div className="flex flex-row">
                              <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage
                                      ?.altText ||
                                    item.merchandise.product.title
                                  }
                                  src={
                                    item.merchandise.product.featuredImage
                                      ?.url || "/imgs/logo-ago.png"
                                  }
                                />
                              </div>
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="z-30 ml-2 flex flex-row space-x-4"
                              >
                                <div className="flex flex-1 flex-col text-base">
                                  <span className="leading-tight">
                                    {item.merchandise.product.title}
                                  </span>
                                  {item.merchandise.title !== DEFAULT_OPTION ? (
                                    <p className="text-sm text-neutral-500">
                                      {item.merchandise.title}
                                    </p>
                                  ) : null}
                                </div>
                              </Link>
                            </div>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm"
                                amount={item.cost.totalAmount.amount}
                                currencyCode={
                                  item.cost.totalAmount.currencyCode
                                }
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                  optimisticUpdate={updateCartItem}
                                />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">
                                    {item.quantity}
                                  </span>
                                </p>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
                <div className="py-4 text-sm text-neutral-500">
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1">
                    <p>Impuestos</p>
                    <Price
                      className="text-right text-base text-black"
                      amount={cart.cost.totalTaxAmount.amount}
                      currencyCode={cart.cost.totalTaxAmount.currencyCode}
                    />
                  </div>
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
                    <p>Envío</p>
                    <p className="text-right">Se calcula en el pago</p>
                  </div>
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
                    <p>Total</p>
                    <Price
                      className="text-right text-base text-black"
                      amount={cart.cost.totalAmount.amount}
                      currencyCode={cart.cost.totalAmount.currencyCode}
                    />
                  </div>
                </div>
                <form action={redirectToCheckout}>
                  <CheckoutButton />
                </form>
              </div>
            )}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors">
      <XMarkIcon
        className={clsx(
          "h-6 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-full bg-black p-3 text-center text-sm font-medium uppercase tracking-wide text-white opacity-90 hover:opacity-100"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Ir a pagar"}
    </button>
  );
}
