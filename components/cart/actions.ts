"use server";

import { TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  getProductRecommendations,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import type { Product } from "lib/shopify/types";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Upsell del carrito ("También te puede gustar") — recomendaciones reales
 * de Shopify (misma fuente que "Ideas para combinar" en la página de
 * producto) a partir del último producto agregado, sin repetir lo que ya
 * está en el carrito ni conjuntos/enterizos (ya son un outfit completo,
 * no tiene sentido sugerir "combinarlo" dentro del carrito tampoco).
 */
export async function getCartUpsell(
  productId: string,
  excludeHandles: string[],
): Promise<Product[]> {
  const recommendations = await getProductRecommendations(productId);

  return recommendations
    .filter((product) => !excludeHandles.includes(product.handle))
    .filter((product) => {
      const type = product.productType.toLowerCase();
      const title = product.title.toLowerCase();
      return type !== "conjunto" && !title.includes("enterizo");
    })
    .slice(0, 2);
}

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    updateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
