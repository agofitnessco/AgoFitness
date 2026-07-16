"use server";

import { CUSTOMER_TOKEN_COOKIE } from "lib/constants";
import {
  createCustomerAddress,
  deleteCustomerAccessToken,
  deleteCustomerAddress,
  loginCustomer,
  registerCustomer,
  setDefaultCustomerAddress,
  updateCustomerAddress,
} from "lib/shopify";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

function friendlyError(message: string): string {
  if (/unidentified customer/i.test(message)) {
    return "Correo o contraseña incorrectos.";
  }
  if (/taken/i.test(message)) {
    return "Ya existe una cuenta con ese correo.";
  }
  if (/too short/i.test(message)) {
    return "La contraseña debe tener al menos 5 caracteres.";
  }
  return message;
}

export async function login(prevState: any, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await loginCustomer(email, password);

  if ("errors" in result) {
    return friendlyError(
      result.errors[0]?.message ?? "No se pudo iniciar sesión.",
    );
  }

  (await cookies()).set(CUSTOMER_TOKEN_COOKIE, result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(result.expiresAt),
    path: "/",
  });

  revalidatePath("/cuenta");
}

export async function register(prevState: any, formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "");
  const lastName = String(formData.get("lastName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await registerCustomer({
    firstName,
    lastName,
    email,
    password,
  });

  if ("errors" in result) {
    return friendlyError(
      result.errors[0]?.message ?? "No se pudo crear la cuenta.",
    );
  }

  // Inicia sesión automáticamente tras registrar — sin este paso el
  // cliente tendría que volver a escribir sus credenciales inmediatamente.
  const loginResult = await loginCustomer(email, password);

  if ("errors" in loginResult) {
    return "Cuenta creada. Inicia sesión con tu correo y contraseña.";
  }

  (await cookies()).set(CUSTOMER_TOKEN_COOKIE, loginResult.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(loginResult.expiresAt),
    path: "/",
  });

  revalidatePath("/cuenta");
}

export async function logout() {
  const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value;

  if (token) {
    await deleteCustomerAccessToken(token);
  }

  (await cookies()).delete(CUSTOMER_TOKEN_COOKIE);
  revalidatePath("/cuenta");
}

function addressFromFormData(formData: FormData) {
  return {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    address1: String(formData.get("address1") ?? ""),
    address2: String(formData.get("address2") ?? ""),
    city: String(formData.get("city") ?? ""),
    province: String(formData.get("province") ?? ""),
    zip: String(formData.get("zip") ?? ""),
    country: String(formData.get("country") ?? "México"),
    phone: String(formData.get("phone") ?? ""),
  };
}

export async function saveAddress(prevState: any, formData: FormData) {
  const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (!token) return "Sesión expirada, vuelve a iniciar sesión.";

  const addressId = String(formData.get("addressId") ?? "");
  const address = addressFromFormData(formData);

  const result = addressId
    ? await updateCustomerAddress(token, addressId, address)
    : await createCustomerAddress(token, address);

  if ("errors" in result) {
    return friendlyError(
      result.errors[0]?.message ?? "No se pudo guardar la dirección.",
    );
  }

  const setDefault = formData.get("setDefault") === "on";
  if (setDefault) {
    await setDefaultCustomerAddress(token, result.addressId);
  }

  revalidatePath("/cuenta");
}

export async function removeAddress(prevState: any, addressId: string) {
  const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (!token) return "Sesión expirada, vuelve a iniciar sesión.";

  const result = await deleteCustomerAddress(token, addressId);

  if ("errors" in result) {
    return friendlyError(
      result.errors[0]?.message ?? "No se pudo eliminar la dirección.",
    );
  }

  revalidatePath("/cuenta");
}

export async function makeDefaultAddress(prevState: any, addressId: string) {
  const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (!token) return "Sesión expirada, vuelve a iniciar sesión.";

  const result = await setDefaultCustomerAddress(token, addressId);

  if ("errors" in result) {
    return friendlyError(
      result.errors[0]?.message ?? "No se pudo actualizar la dirección.",
    );
  }

  revalidatePath("/cuenta");
}
