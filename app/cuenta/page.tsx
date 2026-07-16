import AccountDashboard from "components/account/account-dashboard";
import AuthPanel from "components/account/auth-panel";
import Footer from "components/layout/footer";
import { CUSTOMER_TOKEN_COOKIE } from "lib/constants";
import { getCustomer } from "lib/shopify";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

export default async function CuentaPage() {
  const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value;
  const customer = token ? await getCustomer(token) : undefined;

  return (
    <>
      {customer ? <AccountDashboard customer={customer} /> : <AuthPanel />}
      <Footer />
    </>
  );
}
